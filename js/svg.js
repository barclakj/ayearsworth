// ------------------------------------------------------------------
// 
// Copyright (c) 2013 stellarmap.com
// ------------------------------------------------------------------

/* Defines the standard SVG namespace. */
var svgNS = "http://www.w3.org/2000/svg";
var linkNS = "http://www.w3.org/1999/xlink";
var htmlNS = "http://www.w3.org/1999/xhtml";

/* Removes all child elements from the specified node.
*/
function clearElement(rootNode) {
	if ( rootNode.hasChildNodes() ) {
		while ( rootNode.childNodes.length >= 1 ) {
			rootNode.removeChild( rootNode.firstChild );       
		} 
	}
}



/* Removes node from the specified parent.
*/
function removeElement(nodeId) {
	var node = document.getElementById(nodeId);
	if (node!=null) {
		node.parentNode.removeChild(node);
	}
}

/* Draws a line from x1,y1 to x2,y2 beneath the specified element and with the specified style and id.
*/
function svgDrawLinePc(x1, y1, x2, y2, style, id, rootNode) {
	var lineNode = document.createElementNS(svgNS,"line");
	lineNode.setAttribute("x1",x1 + "%");
	lineNode.setAttribute("y1",y1 + "%");
	lineNode.setAttribute("x2",x2 + "%");
	lineNode.setAttribute("y2",y2 + "%");
	if (style!=null) {
		lineNode.setAttribute("style", style);
	}
	if (id!=null) {
		lineNode.setAttribute("id", id);
	}
	rootNode.appendChild(lineNode);			
	lineNode = null;
}

function svgEndArrowMarker(yoffset, xoffset, scale, fill, id, rootNode) {
	var markerNode = document.createElementNS(svgNS,"svg:marker");
	if (id!=null) {
		markerNode.setAttribute("id", id);
	}
	var size = scale * 1;
	markerNode.setAttribute("viewBox","0 0 10 10");
	markerNode.setAttribute("refX",xoffset);
	markerNode.setAttribute("refY",yoffset);
	markerNode.setAttribute("markerUnits","userSpaceOnUse");
	markerNode.setAttribute("markerHeight", scale);
	markerNode.setAttribute("markerWidth", scale);
	markerNode.setAttribute("style", fill);
	markerNode.setAttribute("orient","auto");
	
	var pathNode = document.createElementNS(svgNS,"svg:path");
	pathNode.setAttribute("d","M 0 0 L 10 5 L 0 10 z");
	
	markerNode.appendChild(pathNode);
	rootNode.appendChild(markerNode);			
	markerNode = null;
	
}

/* Draws a line from x1,y1 to x2,y2 beneath the specified element and with the specified style and id.
*/
function svgDrawLine(x1, y1, x2, y2, style, id, rootNode, startmarker, endmarker) {
	svgDrawLine(x1, y1, x2, y2, style, id, rootNode, null, null);
}

/* Draws a line from x1,y1 to x2,y2 beneath the specified element and with the specified style and id.
*/
function svgDrawLine(x1, y1, x2, y2, style, id, rootNode, startmarker, endmarker) {
	var lineNode = document.createElementNS(svgNS,"svg:line");
	lineNode.setAttribute("x1",x1);
	lineNode.setAttribute("y1",y1);
	lineNode.setAttribute("x2",x2);
	lineNode.setAttribute("y2",y2);
	if (style!=null) {
		lineNode.setAttribute("style", style);
	}
	if (id!=null) {
		lineNode.setAttribute("id", id);
	}

	if (startmarker!=null) {
		lineNode.setAttribute("marker-start", startmarker);
	}
	if (endmarker!=null) {
		lineNode.setAttribute("marker-end", endmarker);
	}
	rootNode.appendChild(lineNode);			
	lineNode = null;
}

/* Draws an image  at location x, y with width w and height h and id as specified.
*/
function svgImage(x, y, w, h, url, id, style, rootNode, xlink, mouseover, mouseout) {
	var linkNode = null;
	if (xlink!=null) {
		linkNode = document.createElementNS(svgNS,"svg:a");
		linkNode.setAttributeNS(linkNS, "xlink:href", xlink);
		rootNode.appendChild(linkNode);
	}
	var imageNode = document.createElementNS(svgNS,"svg:image");
	imageNode.setAttribute("x",x);
	imageNode.setAttribute("y",y);
	imageNode.setAttribute("width",w);
	imageNode.setAttribute("height",h);
	imageNode.setAttributeNS(linkNS, "xlink:href", url);
	
	if (mouseover!=null) {
		imageNode.setAttribute("onmouseover", mouseover); 
	}
	if (mouseout!=null) {
		imageNode.setAttribute("onmouseout", mouseout); 
	}
	if (style!=null) {
		imageNode.setAttribute("style", style);
	}
	if (id!=null) {
		imageNode.setAttribute("id", id);
	}
	if (linkNode!=null) {
		linkNode.appendChild(imageNode);
	} else {
		rootNode.appendChild(imageNode);			
	}
	imageNode = null;
}

/* Draws a circle at location x, y with radius r and style/id as specified.
*/
function svgCircle(x, y, r, style, id, rootNode, xlink, mouseover, mouseout) {
	var linkNode = null;
	if (xlink!=null) {
		linkNode = document.createElementNS(svgNS,"svg:a");
		linkNode.setAttributeNS(linkNS, "xlink:href", xlink);
		rootNode.appendChild(linkNode);
	}
	var circleNode = document.createElementNS(svgNS,"svg:circle");
	circleNode.setAttribute("cx",x);
	circleNode.setAttribute("cy",y);
	circleNode.setAttribute("r",r);
	if (mouseover!=null) {
		circleNode.setAttribute("onmouseover", mouseover); 
	}
	if (mouseout!=null) {
		circleNode.setAttribute("onmouseout", mouseout); 
	}
	if (style!=null) {
		circleNode.setAttribute("style", style);
	}
	if (id!=null) {
		circleNode.setAttribute("id", id);
	}
	if (linkNode!=null) {
		linkNode.appendChild(circleNode);
	} else {
		rootNode.appendChild(circleNode);			
	}
	circleNode = null;
}

/* Draws a rectangle at location x, y with width and height as specified and style/id as specified.
*/
function svgRectangle(x, y, width, height, style, id, rootNode) {
	var rectNode = document.createElementNS(svgNS,"rect");
	rectNode.setAttribute("x",x);
	rectNode.setAttribute("y",y);
	rectNode.setAttribute("height",height);
	rectNode.setAttribute("width",width);
	if (style!=null) {
		rectNode.setAttribute("style", style);
	}
	if (id!=null) {
		rectNode.setAttribute("id", id);
	}
	rootNode.appendChild(rectNode);			
	rectNode = null;
}

/* Writes text out at the specified location using the style/id as specified.
*/
function svgText(x, y, text, style, id, rootNode, xlink) {
	var linkNode = null;
	if (xlink!=null) {
		linkNode = document.createElementNS(svgNS,"svg:a");
		if (style!=null) {
			linkNode.setAttribute("style", style);
		}
		linkNode.setAttributeNS(linkNS, "xlink:href", xlink);
		rootNode.appendChild(linkNode);
	}
	var textNode = document.createElementNS(svgNS,"svg:text");
	textNode.setAttribute("x",x);
	textNode.setAttribute("y",y);
	textNode.setAttribute("text-anchor", "middle");
	if (style!=null) {
		textNode.setAttribute("style", style);
	}
	if (id!=null) {
		textNode.setAttribute("id", id);
	}
	var textElement = document.createTextNode(text);
	textNode.appendChild(textElement);

	textElement = null;
	
	if (linkNode!=null) {
		linkNode.appendChild(textNode);
	} else {
		rootNode.appendChild(textNode);			
	}
	textNode = null;
}

/* Moves a circle from current position to a new X,Y position.
*/
function svgMoveCircle(x, y, id) {
	var node = document.getElementById(id);
	if (node!=null) {
		node.setAttribute("cx", x);
		node.setAttribute("cy", y);
	}
	node = null;
}

/* Checks to see if a node needs to be moved - true if position is as specified else false.
*/
function svgVerifyCirclePosition(x, y, id) {
	var node = document.getElementById(id);
	if (node!=null) {
		if (node.getAttribute("cx")==x && node.getAttribute("cy")==y) return true;
		else return false;
	}
	node = null;
}

/* Resizes a circle.
*/
function svgResizeCircle(r, id) {
	var node = document.getElementById(id);
	if (node!=null) {
		node.setAttribute("r", r);
	}
	node = null;
}

/* Draws a stick diagram based on the connecting the line points provided and style.
*/
function svgLines(xypointlist, style, rootNode) {
	var prevxyp = null;
	while(xypointlist!=null) {
		if (xypointlist.xypoint != null) {
			if (prevxyp!=null) {
				xy1 = xypointlist.xypoint;
				xy2 = prevxyp;
				svgDrawLine(parseInt(xy1.x), parseInt(xy1.y), parseInt(xy2.x), parseInt(xy2.y), style, null, rootNode);
			}
			prevxyp = xypointlist.xypoint;
		}
		xypointlist = xypointlist.next;	
	}
	prevxyp = null;
}

/* Draws an ellipse at location x, y with x radius and height as specified and rotation if required as specified.
 * <ellipse cx="20" cy="20" rx="17" ry="20" style="fill:url(#nebulagrad)"/>
*/
function svgEllipse(x, y, rx, ry, rotation, style, id, rootNode, xlink, mouseover, mouseout) {
	var linkNode = null;
	if (xlink!=null) {
		linkNode = document.createElementNS(svgNS,"svg:a");
		linkNode.setAttributeNS(linkNS, "xlink:href", xlink);
		rootNode.appendChild(linkNode);
	}
	
	var ellipseNode = document.createElementNS(svgNS,"svg:ellipse");
	ellipseNode.setAttribute("cx",x);
	ellipseNode.setAttribute("cy",y);
	ellipseNode.setAttribute("rx",rx);
	ellipseNode.setAttribute("ry",ry);
	if (rotation!=null && rotation!=0.0) {
		ellipseNode.setAttribute("transform", "rotate(" + rotation + ", " + x + ", " + y + ")");
	}
	
	if (style!=null) {
		ellipseNode.setAttribute("style", style);
	}
	
	if (id!=null) {
		ellipseNode.setAttribute("id", id);
	}
	
	if (mouseover!=null) {
		ellipseNode.setAttribute("onmouseover", mouseover); 
	}
	if (mouseout!=null) {
		ellipseNode.setAttribute("onmouseout", mouseout); 
	}
	
	if (linkNode!=null) {
		linkNode.appendChild(ellipseNode);
	} else {
		rootNode.appendChild(ellipseNode);			
	}		
	ellipseNode = null;
}

/* Moves an ellipse from current position to a new X,Y position with dimensions rx,ry and rotation.
*/
function svgMoveEllipse(x, y, rx, ry, rotation, id) {
	var node = document.getElementById(id);
	if (node!=null) {
		node.setAttribute("cx", x);
		node.setAttribute("cy", y);
		node.setAttribute("rx", rx);
		node.setAttribute("ry", ry);
		if (rotation!=null && rotation!=0.0) {
			node.setAttribute("transform", "rotate(" + rotation + ", " + x + ", " + y + ")");
		}
	}
	node = null;
}

/* Draws a symbol at location x, y with width and height as specified and scale/rotation and symbol as specified.
 * <use id="binsb" transform="scale(0.5, 0.5) rotate(5, 420, 220)" x="420" y="220" xlink:href="#binarystars"/>
*/
function svgSymbol(x, y, scalar, rotation, width, height, symbol, id, rootNode) {
	var posx = x;
	var posy = y;
	
	posx = (x/scalar)+(height/scalar);
	posy = (y/scalar)+(width/scalar);
		
	var useNode = document.createElementNS(svgNS,"svg:use");
	useNode.setAttributeNS(linkNS, "xlink:href", "#" + symbol);
	useNode.setAttribute("x",posx);
	useNode.setAttribute("y",posy);
	useNode.setAttribute("transform", "scale(" + scalar + "," + scalar + ") rotate(" + rotation + ", " + posx + ", " + posy + ")");
	
	if (id!=null) {
		useNode.setAttribute("id", id);
	}
	rootNode.appendChild(useNode);			
	useNode = null;
}

/* Moves a symbol from current position to a new X,Y position recalculated based on scalar and rotation.
*/
function svgMoveSymbol(x, y, scalar, rotation, width, height, id) {
	var posx = 0.0 + x;
	var posy = 0.0 + y;
	
	// posx = (x/scalar)+(height/scalar);
	// posy = (y/scalar)+(width/scalar);
	
	var node = document.getElementById(id);
	if (node!=null) {
		node.setAttribute("x", posx);
		node.setAttribute("y", posy);
		// node.setAttribute("transform", "scale(" + scalar + "," + scalar + ") rotate(" + rotation + ", " + posx + ", " + posy + ")");
		node.setAttribute("transform", "scale(1,1)");
	}
	node = null;
}

