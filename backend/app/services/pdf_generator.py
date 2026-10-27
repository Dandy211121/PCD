import os
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm

from app.core.config import REPORTS_DIR, UPLOAD_DIR, ANNOTATED_DIR


def generate_inspection_pdf(
    inspection_id: int,
    location_name: str,
    location_type: str,
    address: str,
    inspector_name: str,
    notes: str,
    original_image_path: str,
    annotated_image_path: str,
    total_grids: int,
    crack_grids: int,
    crack_ratio: float,
    severity_level: str,
    grid_data: list,
    created_at: datetime = None
) -> str:
    """
    Generates a professional engineering PDF report for a crack inspection using ReportLab.
    Returns the relative filename in storage/reports/.
    """
    if created_at is None:
        created_at = datetime.now()

    pdf_filename = f"report_INSP_{inspection_id:04d}_{uuid.uuid4().hex[:8]}.pdf"
    full_pdf_path = REPORTS_DIR / pdf_filename

    doc = SimpleDocTemplate(
        str(full_pdf_path),
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a")
    )
    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b")
    )
    section_title = ParagraphStyle(
        "SectionTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#334155")
    )
    meta_label = ParagraphStyle(
        "MetaLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#475569")
    )

    story = []

    # Header / Title Block
    header_data = [
        [
            Paragraph("<b>CRACK INSPECTION PLATFORM</b><br/><font size=9 color='#2563eb'>SISTEM AUDIT RETAK STRUKTUR BETON AI RESNET-18</font>", title_style),
            Paragraph(f"<b>No. Laporan:</b> INSP-{inspection_id:04d}<br/><b>Tanggal:</b> {created_at.strftime('%d/%m/%Y %H:%M')}", subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[12 * cm, 5.5 * cm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, 0), (-1, -1), 1.5, colors.HexColor("#2563eb"))
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.4 * cm))

    # Location & Inspection Metadata Table
    meta_table_data = [
        [
            Paragraph("<b>Nama Objek/Lokasi:</b>", meta_label), Paragraph(location_name or "-", body_style),
            Paragraph("<b>Tipe Struktur:</b>", meta_label), Paragraph(location_type or "-", body_style)
        ],
        [
            Paragraph("<b>Alamat:</b>", meta_label), Paragraph(address or "-", body_style),
            Paragraph("<b>Inspektor:</b>", meta_label), Paragraph(inspector_name or "-", body_style)
        ],
        [
            Paragraph("<b>Catatan Lapangan:</b>", meta_label), Paragraph(notes or "Pemeriksaan visual rutin struktur.", body_style),
            Paragraph("<b>Metode AI:</b>", meta_label), Paragraph("ResNet-18 Grid Slicing (6x6)", body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[3.2 * cm, 6.0 * cm, 3.2 * cm, 5.1 * cm])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.4 * cm))

    # Metrics Summary Box
    sev_colors = {
        "Aman": colors.HexColor("#16a34a"),
        "Ringan": colors.HexColor("#ca8a04"),
        "Sedang": colors.HexColor("#ea580c"),
        "Kritis": colors.HexColor("#dc2626")
    }
    sev_color = sev_colors.get(severity_level, colors.HexColor("#2563eb"))

    metrics_data = [
        [
            Paragraph(f"<font size=8 color='#64748b'>TOTAL PETAK GRID</font><br/><b><font size=16 color='#0f172a'>{total_grids}</font></b>", body_style),
            Paragraph(f"<font size=8 color='#64748b'>PETAK RETAK TERDETEKSI</font><br/><b><font size=16 color='#dc2626'>{crack_grids}</font></b>", body_style),
            Paragraph(f"<font size=8 color='#64748b'>PERSENTASE KERUSAKAN</font><br/><b><font size=16 color='#2563eb'>{crack_ratio:.1f}%</font></b>", body_style),
            Paragraph(f"<font size=8 color='#64748b'>TINGKAT KEPARAHAN</font><br/><b><font size=15 color='{sev_color.hexval()}'>{severity_level.upper()}</font></b>", body_style),
        ]
    ]
    metrics_table = Table(metrics_data, colWidths=[4.3 * cm, 4.3 * cm, 4.4 * cm, 4.5 * cm])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 0.4 * cm))

    # Inspection Images (Side by Side or Stacked)
    story.append(Paragraph("<b>Dokumentasi Visual Pemindaian:</b>", section_title))
    
    img_cells = []
    # Original Image
    if original_image_path and os.path.exists(original_image_path):
        try:
            orig_rl = RLImage(original_image_path, width=8.5 * cm, height=6.2 * cm)
            img_cells.append([Paragraph("<b>Foto Asli Struktur</b>", subtitle_style), orig_rl])
        except Exception:
            img_cells.append([Paragraph("Foto Asli (Tidak dapat dimuat)", subtitle_style)])
    
    # Annotated Image
    if annotated_image_path and os.path.exists(annotated_image_path):
        try:
            annot_rl = RLImage(annotated_image_path, width=8.5 * cm, height=6.2 * cm)
            if len(img_cells) > 0:
                img_cells[0].extend([Paragraph("<b>Hasil Analisis Petak Grid ResNet-18</b>", subtitle_style), annot_rl])
        except Exception:
            pass

    if img_cells and len(img_cells[0]) >= 4:
        # Side by side: [Label1, Img1, Label2, Img2]
        image_table_data = [
            [img_cells[0][0], img_cells[0][2]],
            [img_cells[0][1], img_cells[0][3]]
        ]
        image_table = Table(image_table_data, colWidths=[8.7 * cm, 8.7 * cm])
        image_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(image_table)
    story.append(Spacer(1, 0.4 * cm))

    # Crack Findings Summary Table
    story.append(Paragraph("<b>Rincian Petak Keretakan Teridentifikasi:</b>", section_title))
    crack_cells = [g for g in grid_data if g.get("is_crack")]

    table_rows = [
        [
            Paragraph("<b>No Petak</b>", meta_label),
            Paragraph("<b>Koordinat (Baris, Kolom)</b>", meta_label),
            Paragraph("<b>Tingkat Keyakinan AI</b>", meta_label),
            Paragraph("<b>Status Analisis</b>", meta_label),
            Paragraph("<b>Rekomendasi Penanganan</b>", meta_label)
        ]
    ]

    if crack_cells:
        for idx, c in enumerate(crack_cells[:8], 1):  # Show up to 8 crack patches for clean fit
            rec_text = "Injeksi Epoxy Sealant" if c.get("confidence", 0) > 80 else "Pembersihan & Monitoring"
            table_rows.append([
                Paragraph(f"P-{c.get('cell_id', idx)}", body_style),
                Paragraph(f"Baris {c.get('row', '-')}, Kolom {c.get('col', '-')}", body_style),
                Paragraph(f"{c.get('confidence', 0)}%", body_style),
                Paragraph("<font color='#dc2626'><b>Retak Terdeteksi</b></font>", body_style),
                Paragraph(rec_text, body_style)
            ])
    else:
        table_rows.append([
            Paragraph("-", body_style),
            Paragraph("Semua Petak Bebas Retak", body_style),
            Paragraph(">95% Normal", body_style),
            Paragraph("<font color='#16a34a'><b>Struktur Normal / Aman</b></font>", body_style),
            Paragraph("Inspeksi Berkala 6 Bulan", body_style)
        ])

    findings_table = Table(table_rows, colWidths=[2.2 * cm, 4.3 * cm, 3.5 * cm, 3.5 * cm, 4.0 * cm])
    findings_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(findings_table)
    story.append(Spacer(1, 0.4 * cm))

    # Engineering Conclusion & Signatures
    concl_text = (
        f"Berdasarkan pemindaian AI Grid Slicing ResNet-18, struktur memiliki tingkat keparahan <b>{severity_level.upper()}</b> "
        f"dengan rasio petak retak <b>{crack_ratio:.1f}%</b>. "
    )
    if severity_level == "Kritis":
        concl_text += "DIPERLUKAN TINDAKAN SEGERA: Segera lakukan audit forensik struktur, pembatasan beban operasional, dan injeksi perbaikan pada petak yang teridentifikasi."
    elif severity_level == "Sedang":
        concl_text += "Disarankan tindakan grouting / perbaikan pelindung retak dalam kurun waktu 30 hari ke depan serta pemasangan sensor retak."
    elif severity_level == "Ringan":
        concl_text += "Retak mikro rambut permukaan. Cukup lakukan penutupan permukaan (surface coating) dan inspeksi berkala."
    else:
        concl_text += "Kondisi fisik permukaan beton dalam keadaan prima dan memenuhi kriteria keamanan struktural."

    story.append(Paragraph(concl_text, body_style))
    story.append(Spacer(1, 0.5 * cm))

    # Sign-off block
    sign_data = [
        [
            Paragraph("Diverifikasi oleh Inspektor Lapangan,<br/><br/><br/><b>( " + inspector_name + " )</b><br/>Inspektor Madya", body_style),
            Paragraph("Disahkan oleh Lead Structural Engineer,<br/><br/><br/><b>( Ir. Bambang Hermanto, M.T., IPU )</b><br/>Ahli Struktur Utama", body_style)
        ]
    ]
    sign_table = Table(sign_data, colWidths=[8.7 * cm, 8.7 * cm])
    sign_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(KeepTogether([sign_table]))

    doc.build(story)
    return pdf_filename
