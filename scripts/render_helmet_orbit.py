"""Render a fixed camera path around the final helmet for the Art page background.

Usage: blender -b -P helmet_orbit.py -- <stl> <out_dir> <frames|"keys">
"""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

stl, out_dir, mode = sys.argv[sys.argv.index("--") + 1:][:3]
out = Path(out_dir)
out.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

bpy.ops.wm.stl_import(filepath=stl)
helmet = bpy.context.selected_objects[0]
helmet.scale = (0.01, 0.01, 0.01)
bpy.context.view_layer.update()
corners = [helmet.matrix_world @ Vector(c) for c in helmet.bound_box]
lo = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
hi = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (lo + hi) / 2
helmet.location -= Vector((centre.x, centre.y, lo.z))
bpy.context.view_layer.update()
size = hi - lo
print("helmet size (m):", tuple(round(v, 3) for v in size))
bpy.ops.object.select_all(action="DESELECT")
helmet.select_set(True)
bpy.context.view_layer.objects.active = helmet
bpy.ops.object.shade_auto_smooth(angle=math.radians(35))

mat = bpy.data.materials.new("Graphite")
mat.use_nodes = True
bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Base Color"].default_value = (0.045, 0.043, 0.05, 1)
bsdf.inputs["Roughness"].default_value = 0.42
helmet.data.materials.append(mat)

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
bg.inputs["Color"].default_value = (0.55, 0.55, 0.6, 1)
bg.inputs["Strength"].default_value = 0.35

def area_light(name, loc, energy, size_m, colour=(1, 1, 1)):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.size = size_m
    data.color = colour
    light = bpy.data.objects.new(name, data)
    scene.collection.objects.link(light)
    light.location = loc
    direction = Vector((0, 0, size.z * 0.5)) - Vector(loc)
    light.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return light

h = size.z
area_light("Key", (2.2 * h, -2.0 * h, 1.8 * h), 900, 1.2 * h)
area_light("RimLeft", (-2.4 * h, 1.6 * h, 1.2 * h), 1400, 0.8 * h, (1.0, 0.86, 0.8))
area_light("RimRight", (2.0 * h, 2.2 * h, 0.9 * h), 1100, 0.8 * h, (0.82, 0.88, 1.0))
area_light("Top", (0, 0, 3.0 * h), 500, 1.5 * h)

target = bpy.data.objects.new("LookAt", None)
scene.collection.objects.link(target)
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 50
camera = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(camera)
scene.camera = camera
track = camera.constraints.new("TRACK_TO")
track.target = target
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"

FRAMES = 96
# Each stop: frame, camera position, look-at point (multiples of helmet height).
stops = [
    (1,  (1.35, -2.45, 0.92), (0.0, 0.0, 0.5)),   # full helmet, three-quarter front
    (20, (0.55, -1.55, 0.62), (0.0, -0.2, 0.42)), # visor slots
    (40, (1.45, -0.2, 0.5), (0.25, 0.0, 0.42)),   # hinge and bolt side
    (60, (0.45, -0.75, 1.75), (0.0, 0.0, 0.88)),  # crest relief from above
    (78, (-1.5, 1.1, 1.05), (0.0, 0.1, 0.62)),    # back of the shell
    (96, (-1.85, -1.95, 0.85), (0.0, 0.0, 0.5)),    # pull back to the whole object
]
for frame, cam_pos, look in stops:
    camera.location = Vector(cam_pos) * h
    target.location = Vector(look) * h
    camera.keyframe_insert("location", frame=frame)
    target.keyframe_insert("location", frame=frame)
for obj in (camera, target):
    for fcurve in obj.animation_data.action.fcurves:
        for point in fcurve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = point.handle_right_type = "AUTO_CLAMPED"

scene.frame_start, scene.frame_end = 1, FRAMES
try:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
except TypeError:
    scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x, scene.render.resolution_y = 1280, 720
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in bpy.types.ColorManagedViewSettings.bl_rna.properties["view_transform"].enum_items] else "Filmic"
if hasattr(scene.eevee, "taa_render_samples"):
    scene.eevee.taa_render_samples = 32
if hasattr(scene.eevee, "use_shadows"):
    scene.eevee.use_shadows = True

frames = [s[0] for s in stops] if mode == "keys" else range(1, FRAMES + 1)
for frame in frames:
    scene.frame_set(frame)
    scene.render.filepath = str(out / f"{frame:03d}.png")
    bpy.ops.render.render(write_still=True)
print("done", len(list(frames)))
