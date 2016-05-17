# illuminate-html-to-pdf
###This contains javascript libraries and files that is used to convert html to a pdf file

###This uses the following js libraries:
1. canvas2image (https://github.com/hongru/canvas2image)
2. html2canvas v0.4.1 (https://github.com/niklasvh/html2canvas)
3. jsPDF v1.2.61 (https://github.com/MrRio/jsPDF)

##How to use
###Inlude the following files in the html page in the following order:
./lib/jsPDF/jspdf.js\s\s
./lib/html2canvas/html2canvas.js\s\s
./lib/canvas2image/canvas2image.js\s\s
./html2pdf.js\s\s

###Call the following function:
html2pdf.print(<sources>, <options>, <delete_sources>);

1. sources - these are jquery objects representing the elements to be printed. Each object will converted into one page in the pdf file.
2. options - configuration of the pdf file
    {
      filename: <filename>,
      orientation: 'landscape' or 'portrait',
      unit: <unit of measurement ('in', 'cm', 'm', etc)>,
      page_size: <paper size ('letter')>,
      width: <width based on the unit>,
      height: <height based on the unit>,
      margin_left: <left margin based on the unit>,
      margin_top: <right margin based on the unit>
    }
3. delete_sources - if to delete the sources or not
 
###Example:
    html2pdf.print(
      [$('body')],
      {
        filename: 'mypdf',
        orientation: 'landscape',
        unit: 'in',
        page_size: 'letter',
        width: 10,
        height: 8,
        margin_left: 0.5,
        margin_top: 0.25
      },
      false
    );

