import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

interface IPoint {
  x: number;
  y: number;
}

@Component({
  selector: "times-table-circle",
  templateUrl: "./times-table-circle.component.html",
  styleUrls: ["./times-table-circle.component.css"]
})
export class TimesTableCircleComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

  // increment by .1

  // width: number = 320;
  // height: number = 240;

  circlePointCanvas: ElementRef<HTMLCanvasElement>;

  width: number = 800;
  height: number = 600;
  radius: number = 250;
  centerX: number = this.width / 2;
  centerY: number = this.height / 2;

  PI2: number = Math.PI * 2;

  pointsPerCircle: number = 200;
  pointRadius: number = 1;
  timesTable: number = 1;

  speed: number = 0.00005;
  speedScale: number = 10;
  lastRenderTime = Date.now();
  isPause: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext("2d");
    this.draw();
  }

  reset(): void {
    this.timesTable = 0;
    this.pointsPerCircle = 200;
    this.speedScale = 10;
    this.radius = 250;
    this.draw();
  }

  pause(): void {
    this.isPause = !this.isPause;
  }

  next(): void {
    this.timesTable += 0.1;
    if(this.timesTable >= 100) this.timesTable = 0;
    this.timesTable = parseFloat(this.timesTable.toFixed(1));
  }

  previous(): void {
    this.timesTable -= 0.1;
    if (this.timesTable <= 0) this.timesTable = 100;
    this.timesTable = parseFloat(this.timesTable.toFixed(1));
  }

  drawCircleAndPoints(): void {
    // draw main circle
    let circle = new Path2D();
    circle.arc(this.centerX, this.centerY, this.radius, 0, this.PI2);
    this.context.stroke(circle);

    // draw points around circle
    for (let i = 0; i < this.pointsPerCircle; i++) {
      let angle = (this.PI2 / this.pointsPerCircle) * i;
      let px = Math.floor(
        this.centerX + this.radius * Math.cos(angle + Math.PI)
      );
      let py = Math.floor(
        this.centerY + this.radius * Math.sin(angle + Math.PI)
      );

      let point = new Path2D();
      point.arc(px, py, this.pointRadius, 0, this.PI2);
      this.context.stroke(point);
    }
  }

  calculatePoints(): IPoint[] {
    let points: IPoint[] = [];

    for (let i = 0; i < this.pointsPerCircle; i++) {
      let angle1 = (this.PI2 / this.pointsPerCircle) * i + Math.PI;
      let x1 = this.centerX + this.radius * Math.cos(angle1);
      let y1 = this.centerY + this.radius * Math.sin(angle1);
      points.push({ x: Math.floor(x1), y: Math.floor(y1) });

      let j = (i * this.timesTable) % this.pointsPerCircle;
      let angle2 = (this.PI2 / this.pointsPerCircle) * j + Math.PI;
      let x2 = this.centerX + this.radius * Math.cos(angle2);
      let y2 = this.centerY + this.radius * Math.sin(angle2);
      points.push({ x: Math.floor(x2), y: Math.floor(y2) });
    }

    return points;
  }

  drawLines(points: IPoint[]): void {
    this.context.strokeStyle = this.percentageToColor(
      (this.timesTable / 100) % (45 / 2),
      360
    );

    this.context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      this.context.moveTo(points[i].x, points[i].y);
      this.context.lineTo(points[i + 1].x, points[i + 1].y);
    }
    this.context.stroke();
  }

  drawText(): void {
    this.context.font = "30px Arial";
    this.context.fillStyle = '#549c93';
    this.context.fillText(this.timesTable.toFixed(1).toString(), 10, 50);
  }

  draw(): void {
    this.context.clearRect(0, 0, this.width, this.height);

    this.drawCircleAndPoints();

    let points = this.calculatePoints();
    this.drawLines(points);

    //this.drawText();

    this.update();

    window.requestAnimationFrame(this.draw.bind(this));
  }

  update(): void {
    var deltaTime = Date.now() - this.lastRenderTime;
    this.lastRenderTime = Date.now();
    if (!this.isPause) {
      this.timesTable += this.speed * this.speedScale * deltaTime;
      if (this.timesTable >= 100) this.timesTable = 0;
      this.timesTable = parseFloat(this.timesTable.toFixed(2));
    }
  }

  percentageToColor(percentage, maxHue = 120, minHue = 0) {
    const hue = percentage * (maxHue - minHue) + minHue;
    return `hsl(${hue}, 100%, 50%)`;
  }
}
