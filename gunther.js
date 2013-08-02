
var MIN_LIFE_ACHTUNG = 65;
var MAX_ADVANCE      = 400;
var DEFAULT_ADVANCE  = 50;
var FIRE_ROUND       = 5;


var Robot = function(r) {
  this.gone_ahead = 0;
};

Robot.prototype.advance = function(r, amount) {
  if (this.gone_ahead >= MAX_ADVANCE) {
    this.gone_ahead = 0;
    r.turn(40);
  }
  this.gone_ahead += amount;
  r.ahead(amount);
};


Robot.prototype.fireRound = function(r) {
  if (r["gunCoolDownTime"] !== undefined && r.gunCoolDownTime) {
    return;
  }

  var i = FIRE_ROUND;
  while (i--) {
    r.fire();
  }
};


Robot.prototype.onIdle = function(ev) {
  var r = ev.robot;

  r.rotateCannon(20 * (this.y % 3 - 1));

  if (r.life <= MIN_LIFE_ACHTUNG) {
    if (r.availableClones > 0) {
      r.clone();
    }
    if (r.availableDisappears > 0) {
      r.disappear()
    }
  }

  r.turn((this.x % 3 -1) * 47);
  this.advance(r, DEFAULT_ADVANCE);
};

Robot.prototype.onRobotCollision = function(ev) {
  var r = ev.robot;

  // Try to turn the turret to the other robot annd fire, if it's an enemy
  if (ev.collidedRobot.id != r.parentId) {
    r.rotateCannon(ev.collidedRobot.bearing);
  }
  
  if (ev.collidedRobot.cannonAngle < 0) {
    this.turnLeft(90);
  } else {
    this.turnRight(90);
  }
  this.advance(r, DEFAULT_ADVANCE);
};


Robot.prototype.onWallCollision = function(ev) {
  var r = ev.robot;
  r.turn(180);
  this.advance(r, MAX_ADVANCE);
};


Robot.prototype.onHitByBullet = function(ev) {
  var r = ev.robot;
  r.rotateCannon(ev.bearing);
};


Robot.prototype.onScannedRobot = function(ev) {
  var r = ev.robot;
  if (ev.scannedRobot.id != r.parentId) {
    this.fireRound(r);
    this.advance(r, DEFAULT_ADVANCE);
  }
};

