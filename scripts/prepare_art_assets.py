"""Extract the student's own Word images for the Art course archive."""

from pathlib import Path
from zipfile import ZipFile
import json
import shutil
import xml.etree.ElementTree as ET

from PIL import Image, ImageOps, ImageDraw

HERE = Path(__file__).resolve().parents[1]
SOURCE = HERE.parent / "网页制作需求i"
TARGET = HERE / "public" / "art-course"
CONTACT = HERE / ".art-contact"
DOCS = {
    "week-1": SOURCE / "week 1" / "week1_process_documentation.docx",
    "week-2": SOURCE / "week 2" / "week2_process_documentation.docx",
    "week-3": SOURCE / "week 3" / "week3_process_documentation.docx",
    "week-4": SOURCE / "week 4" / "Week4_Final_Project_Ideation (3).docx",
    "week-5": SOURCE / "week 5" / "week5_progress_documentation (1).docx",
}
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def extract_doc(slug, path):
    out = TARGET / slug
    out.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, out / "source.docx")
    with ZipFile(path) as archive:
        rels = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
        paths = {r.attrib["Id"]: r.attrib["Target"] for r in rels}
        doc = ET.fromstring(archive.read("word/document.xml"))
        images = []
        for blip in doc.findall(".//a:blip", NS):
            rid = blip.attrib.get("{" + NS["r"] + "}embed")
            target = paths.get(rid, "")
            if not target.startswith("media/"):
                continue
            src = "word/" + target
            if src not in archive.namelist():
                continue
            from io import BytesIO
            try:
                img = Image.open(BytesIO(archive.read(src)))
                img = ImageOps.exif_transpose(img).convert("RGB")
            except Exception:
                continue
            img.thumbnail((1800, 1800))
            name = f"{len(images) + 1:02d}.webp"
            img.save(out / name, "WEBP", quality=86, method=6)
            images.append({"src": f"/art-course/{slug}/{name}", "width": img.width, "height": img.height})
    return images


def contact_sheet(slug, images):
    CONTACT.mkdir(exist_ok=True)
    cell_w, cell_h, cols = 240, 190, 5
    rows = (len(images) + cols - 1) // cols
    board = Image.new("RGB", (cell_w * cols, cell_h * rows), "#e5e4e9")
    draw = ImageDraw.Draw(board)
    for i, item in enumerate(images):
        img = Image.open(TARGET / slug / Path(item["src"]).name)
        img.thumbnail((cell_w - 16, cell_h - 34))
        x = (i % cols) * cell_w + (cell_w - img.width) // 2
        y = (i // cols) * cell_h + 6
        board.paste(img, (x, y))
        draw.text(((i % cols) * cell_w + 10, (i // cols) * cell_h + cell_h - 23), f"{i + 1:02d}", fill="#111111")
    board.save(CONTACT / f"{slug}.jpg", quality=80)


def main():
    manifest = {}
    for slug, path in DOCS.items():
        images = extract_doc(slug, path)
        manifest[slug] = images
        contact_sheet(slug, images)
        print(slug, len(images))
    final_dir = SOURCE / "final project fusion" / "final_documentation"
    final_out = TARGET / "final"
    final_out.mkdir(parents=True, exist_ok=True)
    for src, name in [
        (final_dir / "Final_Project_Process_and_Design_Notes.pdf", "process-notes.pdf"),
        (final_dir / "Final_Project_Four_Part_Technical_Drawings.pdf", "technical-drawings.pdf"),
        (final_dir / "Complete_Fusion_Timeline_111_Steps.pdf", "fusion-timeline.pdf"),
        (final_dir / "Final_Project_Original_Fusion_Model.f3d", "original-model.f3d"),
        (final_dir / "Final_Project_Four_Component_Drawing_Source.f3d", "drawing-source.f3d"),
        (final_dir / "body_contact_sheet.jpg", "body-contact.jpg"),
        (final_dir / "student_notes_contact_sheet.jpg", "sketch-contact.jpg"),
        (final_dir / "Technical_Sheet_01.png", "technical-sheet-01.png"),
        (final_dir / "Technical_Sheet_02.png", "technical-sheet-02.png"),
        (final_dir / "Technical_Sheet_03.png", "technical-sheet-03.png"),
        (final_dir / "Technical_Sheet_04.png", "technical-sheet-04.png"),
        (final_dir / "current_model_view.png", "model-view.png"),
    ]:
        shutil.copy2(src, final_out / name)
    # The source STL meshes are shown as browser-viewable models. Their origins
    # are recentered in the viewer so that each independent export can rotate.
    shutil.copy2(Path.home() / "Downloads" / "Pea pod customized.stl", TARGET / "week-3" / "model.stl")
    shutil.copy2(Path.home() / "Desktop" / "Fall 2026" / "hw3" / "output" / "TennisPeaPod.f3d", TARGET / "week-3" / "source.f3d")
    shutil.copy2(Path.home() / "Desktop" / "Fall 2026" / "hw2_Configuration 1_Body9.stl", TARGET / "week-2" / "funnel-component.stl")
    shutil.copy2(SOURCE / "final project fusion" / "Transparent_Bascinet_Week4_Prototype.f3d", TARGET / "week-4" / "concept-model.f3d")
    models = SOURCE / "final project fusion" / "modelsss"
    for src, name in [
        (models / "helmet.stl", "helmet.stl"),
        (models / "visor right part.stl", "visor.stl"),
        (models / "hinge left.stl", "hinge-left.stl"),
        (models / "hinge right.stl", "hinge-right.stl"),
    ]:
        shutil.copy2(src, final_out / name)
    (HERE / "lib" / "art-image-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
