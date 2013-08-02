
var MIN_LIFE_ACHTUNG = 65;
var FIRE_ROUND       = 5;
var ROBOT_ID         = null;


var Robot = function(r) {
  ROBOT_ID = r.id;
  this.max_advance = Math.min(r.arenaWidth, r.arenaHeight) / 3;
  this.gone_ahead = 0;
  this.rlsign = 1;
};

Robot.prototype.advance = function(r, amount) {
  if (this.gone_ahead >= this.max_advance) {
    this.gone_ahead = 0;
    r.turn(40);
  }
  this.gone_ahead += amount;
  r.ahead(amount);
};


Robot.prototype.onIdle = function(ev) {
  var r = ev.robot;

  if (r.life <= MIN_LIFE_ACHTUNG) {
    if (r.availableClones > 0) {
      r.clone();
    }
    if (r.availableDisappears > 0) {
      r.disappear();
    }
  }

  r.turn((this.x % 3 - 1) * 30);
  this.advance(r, this.max_advance / 2);
  this.rlsign = -this.rlsign;
  r.rotateCannon(this.rlsign * 360);
};

Robot.prototype.onRobotCollision = function(ev) {
  var r = ev.robot;

  r.stop();

  // Try to turn the turret to the other robot and fire, if it's an enemy
  if (ev.collidedRobot.id != r.parentId && ev.collidedRobot.id != ROBOT_ID) {
    r.rotateCannon(ev.collidedRobot.bearing);
  }
  
  if (ev.collidedRobot.cannonAngle < 0) {
    this.turnLeft(90);
  } else {
    this.turnRight(90);
  }
  this.advance(r, this.max_advance / 2);
};


Robot.prototype.onWallCollision = function(ev) {
  var r = ev.robot;
  r.stop();
  r.back(this.max_advance / 5);
  r.turn(90 + ev.bearing);
};


Robot.prototype.onHitByBullet = function(ev) {
  var r = ev.robot;
  r.stop();
  r.rotateCannon(ev.bearing);
  r.back(this.max_advance / 5);
};


Robot.prototype.onScannedRobot = function(ev) {
  var r = ev.robot;
  if (ev.scannedRobot.id != r.parentId && ev.scannedRobot.id != ROBOT_ID) {
    r.stop();
    var n = 5;
    while (n--) r.fire();
  }
};

