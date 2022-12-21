import { Application, Container } from "pixi.js";
import { Rectangle } from "./math";
import { Timer } from "./utils";

// Super stupid implementation. No partitioning whatsoever yet
export class PhysicsContext extends Container {
  // Physics are updated at 30 fps
  private static updateTimer = new Timer(2);
  private static physicsBodies = new Array<PhysicsBody>();

  static init(app: Application) {
    app.ticker.add(this.update.bind(this));
  }

  static addBody(body: PhysicsBody) {
    this.physicsBodies.push(body);
  }

  static update() {
    if (this.updateTimer.advance()) {
      this.physicsBodies.forEach((body) => {
        const bounds = body.getBoundsRect();

        for (let i = 0; i < this.physicsBodies.length; i += 1) {
          const other = this.physicsBodies[i];

          if (body === other) {
            continue;
          }

          if (this.checkCollision(bounds, other.getBoundsRect())) {
            body.onCollisionEnter(other);
            other.onCollisionEnter(body);
            break;
          }
        }
      });
    }
  }

  static checkCollision(a: Rectangle, b: Rectangle): boolean {
    const bInA =
      a.xyInBounds(b.origin.x, b.origin.y) ||
      a.xyInBounds(b.origin.x + b.width, b.origin.y) ||
      a.xyInBounds(b.origin.x + b.width, b.origin.y + b.height) ||
      a.xyInBounds(b.origin.x, b.origin.y + b.height);
    const aInB =
      b.xyInBounds(a.origin.x, a.origin.y) ||
      b.xyInBounds(a.origin.x + a.width, a.origin.y) ||
      b.xyInBounds(a.origin.x + a.width, a.origin.y + a.height) ||
      b.xyInBounds(a.origin.x, a.origin.y + a.height);

    return bInA || aInB;
  }
}

export interface PhysicsBody {
  kind(): string;
  getBoundsRect(): Rectangle;
  onCollisionEnter(other: PhysicsBody): void;
}
