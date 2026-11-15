
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Setup fonts
(pdfMake as any).vfs =
    (pdfFonts as any).pdfMake?.vfs ||
    (pdfFonts as any).default?.pdfMake?.vfs ||
    (pdfFonts as any).default?.vfs;

// =======================
// GENERATE PDF
// =======================
export const generatePDF_simple = (
    data: any[],
    title: string,
    columns: { key: string; label: string }[],

    orientation?: 'portrait' | 'landscape',
    paperFormat?: 'A4' | 'A3'
) => {

    const headerRow = [
        'NO.',
        ...columns.map(col => col.label.toUpperCase())
    ];

    const tableData = (data || []).map((item, index) => [
        { text: `${index + 1}`, alignment: 'center' },

        ...columns.map(col => ({
            text: `${item[col.key] ?? '-'}`.toUpperCase(),
            alignment: 'center'
        }))
    ]);

    const dd: any = {
        pageSize: paperFormat || 'A4',
        pageOrientation: orientation || 'portrait',
        pageMargins: [40, 50, 40, 40],

        content: [
            {
                text: title,
                bold: true,
                fontSize: 14,
                alignment: 'center',
                decoration: 'underline',
                margin: [0, 0, 0, 20]
            },

            {
                layout: {
                    defaultBorder: true,
                    fillColor: () => 'white',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                },

                table: {
                    headerRows: 1,
                    widths: [
                        'auto',
                        ...columns.map(() => '*')
                    ],

                    body: [
                        headerRow.map(text => ({
                            text,
                            bold: true,
                            fontSize: 9,
                            alignment: 'center',
                            margin: [0, 3, 0, 3]
                        })),

                        ...tableData.map(row =>
                            row.map((cell: any) => ({
                                ...cell,
                                fontSize: 9
                            }))
                        )
                    ]
                }
            }
        ]
    };

  
    pdfMake.createPdf(dd).download(`${title}.pdf`);
};
