function BubbleMap() {
    this.minx = 0;
    this.maxx = 100;
    this.miny = 0;
    this.maxy = 100;
    this.zoom = 1.0;
    this.unitVolume = 50.0;
    this.rootNode = null;
    this.xoffset = 0.0;
    this.yoffset = 0.0;

    this.targetStyle = "stroke-width: 2.0; fill: #0000ff; stroke: #0000ff; fill-opacity: 0.01;";
    this.overSpillTargetStyle = "stroke-width: 2.0; fill: none; stroke: #ff0000;";
    this.theoreticalStyle = "stroke-width: 3.0; fill: none; stroke: #00ff00;";

    // calc'd
    this.scale = 1.0;
    this.yshift = 0.0;
    this.xshift = 0.0;
}

BubbleMap.prototype.calcScale = function(bubbles) {
    var aminx = 999999999.9;
    var amaxx = -999999999.9;
    var aminy = 999999999.9;
    var amaxy = -999999999.9;

    for(var bb=0; bb<bubbles.length; bb++) {
        var b = bubbles[bb];
        if ((b.x-b.radius) < aminx)  aminx = b.x-b.radius;
        if ((b.x+b.radius) > amaxx)  amaxx = b.x+b.radius;
        if ((b.y-b.radius) < aminy)  aminy = b.y-b.radius;
        if ((b.y+b.radius) > amaxy)  amaxy = b.y+b.radius;
    }

    var rangex = amaxx - aminx;
    var rangey = amaxy - aminy;

    var scalex = (this.maxx-this.minx)/rangex;
    var scaley = (this.maxy-this.miny)/rangey;
    var scale = 0.0;
    if (scalex<scaley) {
        scale = scalex;
    } else {
        scale = scaley;
    }
    scale *= this.zoom;
    this.scale = scale;
    this.xshift = 0.0 - (aminx);
    this.yshift = 0.0 - (aminy);
    return this.scale;
}

BubbleMap.prototype.drawTarget = function(maxes, bubbles) {
    var width = this.maxx - this.minx;
    var height = this.maxy - this.miny;
    
    var hw = bubbles[0].scaledX + (width-maxes[0])/2.0;
    var hh = bubbles[0].scaledY + (height-maxes[1])/2.0;

    var radius = 0;
    var i = 1;

    var theoryMax = theoreticalUnitsOfWork(bubbles, this.unitVolume);
  
    while((hw+radius)<maxes[0] || (hh+radius)<maxes[1]) {
       radius = volumeToRadius((i*this.unitVolume))*this.scale;
       var style = this.overSpillTargetStyle;
       if (i<theoryMax) style = this.targetStyle;
       svgCircle(hw, hh, radius, style, null, this.rootNode, null, null, null);
       i++;
    }
    svgCircle(hw, hh, volumeToRadius(theoryMax*this.unitVolume)*this.scale, this.theoreticalStyle, null, this.rootNode, null, null, null);
    return (i-1);
}

BubbleMap.prototype.renderBubbles = function(bubbles, showvals) {
    var width = this.maxx - this.minx;
    var height = this.maxy - this.miny;

    var maxes = scale(bubbleMap, mybubbles);
    var numUnitsOfWork = bubbleMap.drawTarget(maxes, mybubbles);
    console.log("Estimated units of work: " + numUnitsOfWork + " to complete " + mybubbles.length + " pieces of work of. Should be: " + theoreticalUnitsOfWork(bubbles, bubbleMap.unitVolume) + " units");

    //alert("size: " + mybubbles.length);
    for(var bb=0; bb<bubbles.length; bb++) {
        var b = bubbles[bb];
        if (b.volume>0) { // ignore anything of zero effort
            // alert(b.x + ", " + b.y + ", " + b.radius);
            // console.log(b.radius);
            svgCircle(b.scaledX + (width-maxes[0])/2.0, b.scaledY + (height-maxes[1])/2.0, b.scaledRadius, b.style, null, this.rootNode, null, null, null);

            var str = null;
            if (showvals) {
                if (b.name!=null) {
                    str = b.name + " (" + b.value + ")";
                } else {
                    str = "(" + b.value + ")";
                }
            } else {
                if (b.name!=null) {
                    str = b.name;
                } 
            }
            var url = null;
            if(b.url!=null && b.url.trim()!='') {
                url = b.url;
            }

            if (str!=null) {
                svgText(b.scaledX + (width-maxes[0])/2.0, b.scaledY + (height-maxes[1])/2.0, str, b.textstyle, null, this.rootNode, url);
            }
        }
    }

    return numUnitsOfWork;
}

function Bubble() {
    this.x = 0.0;
    this.y = 0.0;
    this.radius = 0.0;
    this.volume = 0.0;
    this.value = 0.0;
    this.positioned = false;

    this.style = "stroke: #232323; stroke-width: 0.5; fill: #b5b5b5; fill-opacity: 0.8;";
    this.textstyle = "stroke-width: 0; fill: #000000;";
    this.name = null;
    this.url = null;

    this.drawfunction = null;

    this.scaledRadius = 0.0;
}

function BubbleLink() {
    this.from = null;
    this.to = null;
}

var ___scale = 1.0;

function volumeToRadius(volume) {
    return Math.sqrt(volume/Math.PI); 
}

function calculateBubbleRadius(bubble) {
    bubble.radius = volumeToRadius(bubble.volume);
    // console.log('Radius: ' + bubble.radius + " Vol: " + bubble.volume);
}

function theoreticalUnitsOfWork(bubbles, unitOfWorkSize) {
    var totalVolume = 0.0;
    for(var i=0;i<bubbles.length;i++) {
        totalVolume += bubbles[i].volume;
    }
    console.log("total volume: " + totalVolume);
    return (totalVolume/unitOfWorkSize);
}

/**
 * Scale the bubble map to the dimensions (min and max x,y) provided.
 * Zoom and offset as appropriate.
 * @param bubbles
 * @param minx
 * @param maxx
 * @param miny
 * @param maxy
 * @param zoom
 * @param xoffset
 * @param yoffset
 */
function scale(bubbleMap, 
                bubbles) {
    bubbleMap.calcScale(bubbles);
    var finalMaxWidth = 0.0;
    var finalMaxHeight = 0.0;
    
    for(var bb=0; bb<bubbles.length; bb++) {
        var b = bubbles[bb];
        b.scaledX = ((b.x + bubbleMap.xshift)*bubbleMap.scale)-bubbleMap.xoffset;
        b.scaledY = ((b.y + bubbleMap.yshift)*bubbleMap.scale)-bubbleMap.yoffset;
        b.scaledRadius = b.radius * bubbleMap.scale;
        if ((b.scaledX + b.scaledRadius) > finalMaxWidth) finalMaxWidth = (b.scaledX + b.scaledRadius);
        if ((b.scaledY + b.scaledRadius) > finalMaxHeight) finalMaxHeight = (b.scaledY + b.scaledRadius);

    }
    return [finalMaxWidth, finalMaxHeight];
}

/**
 * Utility function to sort bubbles and order
 * by largest first.
 * @param bubbles
 */
function sort(bubbles) {
    bubbles.sort( function(o1,o2) {
        if (o1.radius > o2.radius) {
            return -1.0;
        } else if (o2.radius > o1.radius) {
            return 1.0;
        } else {
            return 0.0;
        }
    });
    // Collections.sort(bubbles, new BubbleComparator());
}

/**
 * Positions a list of bubbles on a 2d plane.
 * Each bubble will touch other bubbles.
 * if links specified then find bubbles which are already
 * positioned and move to the closest point to all (sum) of these.
 * @param bubbles
 * @param links
 */
function position(bubbles, links) {
    // sort bubbles by radius (largest to smallest)
    // sort(bubbles);
    if (bubbles.length<1) return;

    // reset all bubbles to no position.
    for(var bb=0; bb<bubbles.length; bb++) {
        var b = bubbles[bb];
        b.positioned = false;
    }

    // place first bubble in position (0,0)
    var b0 = bubbles[0];
    b0.positioned = true;
    b0.x = 0.0;
    b0.y = 0.0;

    // object to hold positioned bubbles
    var positionedBubbles = [];
    // add this first bubble to the list
    positionedBubbles.push(bubbles[0]);

    // now work through bubbles finding those with no position
    for(var bb=0; bb<bubbles.length; bb++) {
        var b = bubbles[bb];
        if (!b.positioned) {
            // find other bubbles which are already positioned.
            var possiblePoints = findIntersects(b, positionedBubbles);

            if (possiblePoints==null || possiblePoints.length==0) {
                // this should never happen!
            } else {
                // choose a random point from those available
                // int pt = (int)(Math.random()*(double)(possiblePoints.length));
                // Bubble p = possiblePoints.get(pt);

                if (links!=null) {
                    // alert('Name: ' + b.name);
                    // if links specified then find connected bubbles
                    // which are alreadt positioned - return as array of bubbles. 
                    var connBubbles = findConnectedBubbles(b.name, bubbles, links);
                    // alert('Connected: ' + connBubbles.length);
                    if (connBubbles!=null && connBubbles.length>0) {
                        // so we have some bubbles connected... which are already positioned...
                        // find the point in the set of possiblepoints
                        // which has the minimum overall sum for all connected bubbles.

                        var p = getClosestSumPoint(possiblePoints, connBubbles, b.x, b.y, b.radius);
                        if (p!=null) {
                            b.x = p.x;
                            b.y = p.y;
                            b.positioned = true;
                            // alert(b.x + "," + b.y);
                        }
                    }
                }

                if (!b.positioned) {
                    var p = getClosestPoint(possiblePoints, 0.0, 0.0);
                    b.x = p.x;
                    b.y = p.y;
                    b.positioned = true;
                }
                positionedBubbles.push(b);
            }
        }
    }
}

/**
* Find the closet point whos sum of distance to all connected bubbles
* is the minimum. Add distsnce from preferred location to distance divided by the
* preferred weight.
* @param allPoints
* @param connBubbles
* @param prefX
* @param prefY
* @param prefWeight
*/
function getClosestSumPoint(allPoints, connBubbles, prefX, prefY, prefWeight) {
    var bestSum = 0.0;
    var bestPoint = null;

    // for each point that could be valid... find the distance to all bubbles
    // and determine closest valid point overall.
    for(var j=0;j<allPoints.length;j++) {
        var pt = allPoints[j];
        var ptDistance = 0.0;

        var prefdx = prefX - pt.x;
        var prefdy = prefY - pt.y;
        var prefdist = (prefdx*prefdx)+(prefdy*prefdy);
        ptDistance = prefdist/prefWeight;

        // for this point, find distance to all
        // connected bubbles.
        for(var i=0;i<connBubbles.length;i++) {
            var bub = connBubbles[i];
            // alert('Checking ' + pt.x + ',' + pt.y + ' for ' + bub.name);

            // safety check it's positioned...
            if (bub.positioned) {
                // calc distance
                var p2dx = bub.x - pt.x;
                var p2dy = bub.y - pt.y;
                var d = (p2dx*p2dx)+(p2dy*p2dy);
                // add to overall distance for this point.
                ptDistance = ptDistance + d;
            }
        }
        // check if the point is closer than current best (or if current is null)
        if (ptDistance<bestSum || bestPoint==null) {
            bestPoint = pt;
            bestSum = ptDistance;
        }
    }
    // alert(bestSum);

    return bestPoint;
}

/**
* Return bubbles linked to/from by named bubbles which name 
* already been positioned.
* @param name
* @param bubbles
* @param links
*/
function findConnectedBubbles(name, bubbles, links) {
    var linkedBubbles = [];
    
    // for each link
    for(var i=0;i<links.length;i++) {
        var b = null;
        // find by name if linked to or from,
        if (links[i].from.name == name) {
            // alert(links[i].from.name + " = " + name);
            b = getBubbleByName(links[i].to.name, bubbles);
        } else if (links[i].to.name == name) {
            // alert(links[i].to.name + " = " + name);
            b = getBubbleByName(links[i].from.name, bubbles);
        }
        // and if not null (found) and positioned then add to array.
        if (b!=null && b.positioned) {
            // alert('Added: ' + b.name);
            linkedBubbles.push(b);
        }
    }
    return linkedBubbles;
}

/**
* Return bubble with the specified name or null if not found.
* @param name
* @param bubbles
*/
function getBubbleByName(name, bubbles) {
    var b = null;

    if (name!=null && bubbles!=null) {
        for(var i=0;i<bubbles.length;i++) {
            if (name==bubbles[i].name) {
                b = bubbles[i];
                break;
            }
        }
    }

    return b;
}

/**
 * Returns the closest point to x, y - location of the largest bubble
 * @param allPoints
 * @return
 */
function getClosestPoint(allPoints, x, y) {
    var distance = 999999999999.9;
    var p = null; // Bubble

    for (var p2a=0; p2a<allPoints.length; p2a++) {
        var p2 = allPoints[p2a];
        var p2dx = x - p2.x;
        var p2dy = y - p2.y;
        var d = (p2dx*p2dx)+(p2dy*p2dy);
        if (d<distance || p==null) {
            distance = d;
            p = p2;
        }
    }

    return p;
}

/**
 * Find all potential intersect points at
 * which we may be able to place a bubble.
 * @param b
 * @param positionedBubbles
 * @return
 */
function findIntersects(b, positionedBubbles) {
    var foundIntersectPoints = [];

    // loop round and compare each bubble with each other bubble to find
    // potential intersect points at which we may focus the new bubble.
    var size = positionedBubbles.length;
    for(var i=0;i<size;i++) {
        var b1 = positionedBubbles[i];
        // we don't need to do those less than index i since they've
        // already been compared.
        for (var j=(i+1); j<size; j++) {
            var b2 = positionedBubbles[j];

            // radius of circles to find intersects is the sum of the bubble being
            // compared and the bubble to place.
            var r1 = b1.radius + b.radius;
            var r2 = b2.radius + b.radius;

            // find all intersects for the two bubbles
            var intersects = circleCircleIntersect(b1.x, b1.y, r1, b2.x, b2.y, r2);

            if (intersects!=null) {
                for(var pi=0; pi<intersects.length; pi++) {
                    var p = intersects[pi];
                    // first assume we can add it
                    foundIntersectPoints.push(p);
                    // then loop round all existing bubbles to see
                    // if the intersect point is within another bubble
                    // exclude if it is and terminate this loop as cannot be used.
                    for (var b3p=0; b3p<positionedBubbles.length; b3p++) {
                        var b3 = positionedBubbles[b3p];
                        // don't compare to the bubbles used to produce
                        // the intersect points as will always match
                        if (b3!=b1 && b3!=b2) {
                            if (checkPointInCircle(p, b3, b.radius)) {
                                var index = foundIntersectPoints.indexOf(p);
                                if (index > -1) {
                                    foundIntersectPoints.splice(index, 1);
                                }
                                // foundIntersectPoints.remove(p);
                                break;
                            }
                        }
                    }
                }

            }
        }
    }

    // If we've not found anywhere then place next to the first bubble
    if (foundIntersectPoints.length==0) {
        var b1 = positionedBubbles[0];
        var p1 = new Bubble();
        p1.x = b1.x + b.radius + b1.radius;
        p1.y = b1.y;
        foundIntersectPoints.push(p1);
    }

    return foundIntersectPoints;
}

/**
 * Check the point p to see if it overlaps bubble b if
 * it has radius of rb.
 * @param p
 * @param b2
 * @param rb
 * @return
 */
function checkPointInCircle(p, b2, rb) {
    var rval = false;

    var r = Math.sqrt(Math.pow((p.x - b2.x), 2.0) + Math.pow((p.y - b2.y), 2.0))-rb;
    if (r<=b2.radius) {
        rval = true;
    }

    return rval;
}

/**
 * Courtsey of: http://paulbourke.net/geometry/circlesphere/
 * and: http://paulbourke.net/geometry/circlesphere/tvoght.c
 * @param x0
 * @param y0
 * @param r0
 * @param x1
 * @param y1
 * @param r1
 * @return
 */
function circleCircleIntersect(x0, y0, r0,
                x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

/* dx and dy are the vertical and horizontal distances between
* the circle centers.
*/
    dx = x1 - x0;
    dy = y1 - y0;

/* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

/* Check for solvability. */
    if (d > (r0 + r1))
    {
/* no solution. circles do not intersect. */
        //log.finest("Circles do not intersect...");
        return null;
    }
    if (d < Math.abs(r0 - r1))
    {
/* no solution. one circle is contained in the other */
        //log.finest("Circles within circles...");
        return null;
    }

/* 'point 2' is the point where the line through the circle
* intersection points crosses the line between the circle
* centers.
*/

/* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

/* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

/* Determine the distance from point 2 to either of the
* intersection points.
*/
    h = Math.sqrt((r0 * r0) - (a * a));

/* Now determine the offsets of the intersection points from
* point 2.
*/
    rx = -dy * (h/d);
    ry = dx * (h/d);

/* Determine the absolute intersection points. */
    var p1 = new Bubble();
    var p2 = new Bubble();

    p1.x = x2 + rx;
    p2.x = x2 - rx;
    p1.y = y2 + ry;
    p2.y = y2 - ry;

    pts = []; // new ArrayList<Bubble>();
    pts.push(p1);
    pts.push(p2);

    return pts;
}




/**
* Draw bubbles in the specified div and SVG G.
*/
function xdrawBubbles(bubbles, links, divName, gName) {
    scaleBubblePosition(bubbles, divName);

    var rootNode = document.getElementById(gName);
    clearElement(rootNode);

    var defaultLineStyle = "stroke-width: 0.5; stroke: #343434;";
    var defaultBubbleStyle = "stroke-width: 1.5; fill: #DCDCDC; stroke: #343434;";
    var defaultTextStyle = "stroke-width: 0.5; stroke: #DCDCDC; font-family: sans-serif; font-size: 12px;";

    if (links!=null && links.length>0) {
        for(var i=0;i<links.length;i++) {
            var bubbleLink = links[i];
            var ba = bubbleLink.from;
            var bb = bubbleLink.to;

            if (ba.radius>1 && bb.radius>1) {
                svgDrawLine(ba.x, ba.y, bb.x,bb.y, defaultLineStyle, null, rootNode, null, null);
            }
        }
    }

    if (bubbles!=null && bubbles.length>0) {
        for(var bb=0; bb<bubbles.length; bb++) {
            var b = bubbles[bb];
            var style = b.style;
            if (style==null) style = defaultBubbleStyle;

            var url = null;
            if(b.url!=null && b.url.trim()!='') {
                url = b.url;
            }

            var str = null;
            
            if (b.name!=null) {
                str = b.name + " (" + b.value + ")";
            } else {
                str = "(" + b.value + ")";
            }

            console.log(b.x + " " + b.y);
                    

            if (b.radius>1) {
                if (b.drawfunction==null) {
                    svgCircle(b.x, b.y, (b.radius*0.78), style, null, rootNode, url, null, null);
                    if (str!=null) {
                        var textStyle = b.textStyle;
                        if (textStyle==null) textStyle = defaultTextStyle;
                        svgText(b.x, b.y + 5, str, textStyle, null, rootNode, url);
                    }
                } else {
                    b.drawfunction(b.x, b.y, (b.radius*0.78), str, rootNode);
                }
            }
            
        }
    }
}

/**
* Scales bubbles so that they fit insted the specified div.
*/
function scaleBubblePosition(bubbles, divName) {
    if (bubbles!=null && bubbles.length>0) {
        var width = document.getElementById(divName).clientWidth;
        var height = document.getElementById(divName).clientHeight;
        
        var hw = width/2.0;
        var hh = height/2.0;

        var maxes = scale(bubbles, 0.0, hw*2.0, 0.0, hh*2.0, 1.0, 0.0, 0.0);

        for(var bb=0; bb<bubbles.length; bb++) {
            var b = bubbles[bb];
            // alert(b.x + ", " + b.y + ", " + b.radius);
            b.x = b.x + (width-maxes[0])/2.0;
            b.y = b.y + (height-maxes[1])/2.0;
        }
    }
}

