function dona(canva, myVinyls) {


    var myCanvas = canva;

    var ctx = myCanvas.getContext("2d");
   

    function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

    }
   
    var variable = "\"\n\n\n";

    var Piechart = function(options) {

        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        this.draw = function() {
            var total_value = 0;
            var color_index = 0;
            for (var categ in this.options.data) {
                var val = this.options.data[categ];
                total_value += val;
            }



            var start_angle = 0;

            for (categ in this.options.data) {
                val = this.options.data[categ];
                var slice_angle = 2 * Math.PI * val / total_value;


                drawPieSlice(

                    this.ctx,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    Math.min(this.canvas.width / 2, this.canvas.height / 2),
                    start_angle,
                    start_angle + slice_angle,
                    this.colors[color_index % this.colors.length]

                );

                start_angle += slice_angle;
                color_index++;

            }

            //drawing a white circle over the chart

            //to create the doughnut chart

            if (this.options.doughnutHoleSize) {

                drawPieSlice(
                    this.ctx,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    this.options.doughnutHoleSize * Math.min(this.canvas.width / 2, this.canvas.height / 2),
                    0,

                    2 * Math.PI,

                    "#FFFFFF"

                    );

            }
            


        }
    }
    var myLegend = document.getElementById("myLegend");
    var myDougnutChart = new Piechart(
        {
            canvas: myCanvas,
            data: myVinyls,
            colors: ['#0B610B', '#DF0101', '#013ADF', '#D7DF01'],
            doughnutHoleSize: 0.5,
            legend: myLegend

        }

    );
    myDougnutChart.draw();
}