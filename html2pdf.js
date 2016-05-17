var html2pdf = {
    $sources: null,
    $container: null,
    options: null,
    width: null,
    totalHeight: null,
    createdPages: 0,
    removeSources: false,

    print: function($sources, options, removeSources)
    {
        console.time("concatenation");

        this.$sources = $sources;
        this.$container = $('#html2canvas');
        this.options = options;
        this.removeSources = removeSources;
        this.width = 0;
        this.totalHeight = 0;
        this.createdPages = 0;
        this.pdf = new jsPDF(this.options.orientation, this.options.unit, this.options.page_size);

        this.$container.html('');

        for (var i = 0; i < this.$sources.length; i++) {
            this.addSource(this.$sources[i]);
        }

        this.renderImage();
    },

    addSource: function($source) {
        var sourceWidth  = $source.width();
        var sourceHeight = $source.height();
        var $clone       = $source.clone();

        $clone.css('background-color', '#ffffff');
        $clone.width(sourceWidth);
        $clone.height(sourceHeight);

        this.$container.append($clone);

        if (sourceWidth > this.width) {
            this.width = sourceWidth;
        }

        this.totalHeight += sourceHeight;
    },

    renderImage: function() {
        var self = this;

        self.$container.removeClass('hidden');
        self.$container.width(this.width);

        html2canvas(this.$container[0], {
            onrendered: function(canvas) {
                self.$container.addClass('hidden');
                self.image = Canvas2Image.convertToJPEG(canvas);
                self.canvas = canvas;

                var timeout = 100 * self.$sources.length;

                setTimeout("PDFPrinter.createPages()", timeout);
            }
        });
    },

    createPages: function()
    {
        var self        = this;
        var canvas      = this.canvas;
        var imageWidth  = canvas.width;
        var imageHeight = canvas.height;
        var xStart      = 0;
        var yStart      = 0;
        var image       = this.image;

        for (var i = 0; i < this.$sources.length; i++) {
            var $source           = this.$sources[i];
            var sourceHeight      = $source.height();
            var pageImageHeight   = (sourceHeight * imageHeight) / this.totalHeight;
            var pageImage         = this.createPageImage(canvas, image, imageWidth, imageHeight, pageImageHeight, xStart, yStart);
            var pageImageData     = pageImage.src;
            var actualImageWidth  = this.options.width;
            var actualImageHeight = pageImageHeight * (this.options.width/imageWidth);

            if (actualImageHeight > this.options.height) {
                actualImageWidth = imageWidth * (this.options.height/pageImageHeight);
                actualImageHeight = this.options.height;
            }

            if (i > 0) {
                this.pdf.addPage();
            }

            // There is some issue in firefox where the image rendered is black
            // whenever we add the image immediately to the pdf
            PDFPrinter.pageCreated(pageImageData, actualImageWidth, actualImageHeight);

            yStart += pageImageHeight;
        }
    },

    createPageImage: function(canvas, image, imageWidth, imageHeight, pageImageHeight, xStart, yStart) {
        var pageCanvas = canvas;

        pageCanvas.setAttribute('height', pageImageHeight);
        pageCanvas.setAttribute('width', imageWidth);

        var ctx = pageCanvas.getContext("2d");

        ctx.drawImage(
            image,
            xStart,
            yStart,
            imageWidth,
            pageImageHeight,
            0,
            0,
            imageWidth,
            pageImageHeight
        );

        return Canvas2Image.convertToJPEG(pageCanvas);
    },

    pageCreated: function(pageImageData, width, height)
    {
        this.pdf.addImage(
            pageImageData,
             'JPEG',
            this.options.margin_left,
            this.options.margin_top,
            width,
            height
        );

        if (++this.createdPages == this.$sources.length) {
            this.download();
        }
    },

    download: function()
    {
        this.pdf.save(this.options.filename + '.pdf');

        if (this.removeSources === true) {
            for (var i = 0; i < this.$sources.length; i++) {
                this.$sources[i].remove();
            }
        }

        console.timeEnd("concatenation");
    },
};
