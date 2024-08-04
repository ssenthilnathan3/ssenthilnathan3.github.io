import React, { useState, useEffect } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import './canvas.css';

const numStars = 500;
let stars = [];
let customFont;
let fontLoaded = false;
let fadeAmount = 0;
let heartClickCount = 5;

function sketch(p5) {
  let heartX, heartY, heartW, heartH;

  p5.preload = () => {
    customFont = p5.loadFont('/assets/ARCADECLASSIC.TTF');
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.stroke(255);
    p5.strokeWeight(2);
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(p5.random(p5.width), p5.random(p5.height)));
    }
    fontLoaded = true;
    
    // Initialize heart position and size
    heartX = p5.width / 2 - 70;
    heartY = p5.height / 2 - 60;
    heartW = 100;
    heartH = 100;

    p5.mousePressed = () => {
      // Check if mouse is inside the heart
      const mouseDist = p5.dist(p5.mouseX, p5.mouseY, heartX + heartW / 2, heartY + heartH / 2);
      const maxDist = heartW / 2;
      if (mouseDist < maxDist) {
        heartClickCount--;
        if (heartClickCount == 0) {
          window.location.href = '/#/finally'; // Replace with your desired URL
        }
      }
    };
  };

  p5.draw = () => {
    p5.background(255, 50);

    if (!fontLoaded) {
      p5.textSize(32);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.fill(255);
      p5.text("Loading...", p5.width / 2, p5.height / 2);
      return;
    }

    const acc = p5.map(p5.mouseX, 0, p5.width, 0.005, 0.2);

    stars = stars.filter(star => {
      star.draw(p5);
      star.update(acc);
      return star.isActive(p5.width, p5.height);
    });

    while (stars.length < numStars) {
      stars.push(new Star(p5.random(p5.width), p5.random(p5.height)));
    }

    p5.fill(250, 0, 100);
    heart(p5, heartX, heartY, heartW, heartH);

   // Make text size responsive
  const textSizeMain = p5.width / 21; // Adjust based on canvas width
  const textSizeSecondary = p5.width / 22; // Adjust based on canvas width

  p5.textSize(textSizeMain);
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.fill(0);
  p5.text(`You are close to your dreams!`, p5.width / 2, p5.height / 4);
  p5.textFont(customFont);
  p5.textSize(textSizeSecondary);
  p5.text(`Wanna see mine! you are ${heartClickCount} clicks away`, p5.width / 2, p5.height / 4 + 50);
  };

  class Star {
    constructor(x, y) {
      this.pos = p5.createVector(x, y);
      this.prevPos = p5.createVector(x, y);
      this.vel = p5.createVector(0, 0);
      this.ang = p5.atan2(y - p5.height / 2, x - p5.width / 2);
    }

    isActive(width, height) {
      return onScreen(this.prevPos.x, this.prevPos.y, width, height);
    }

    update(acc) {
      this.vel.x += p5.cos(this.ang) * acc;
      this.vel.y += p5.sin(this.ang) * acc;
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }

    draw(p5) {
      const alpha = p5.map(this.vel.mag(), 0, 3, 0, 255);
      p5.stroke(0, alpha);
      p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    }
  }

  function onScreen(x, y, width, height) {
    return x >= 0 && x <= width && y >= 0 && y <= height;
  }

  function heart(p5, x, y, w, h) {
    const mouseDist = p5.dist(p5.mouseX, p5.mouseY, x + w / 2, y + h / 2);
    const maxDist = p5.width / 2;
    const strokeWeightValue = p5.map(mouseDist, 0, maxDist, 10, 1);
    
    p5.strokeWeight(strokeWeightValue);
    p5.beginShape();
    p5.vertex(x + 8 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 8 * w / 16, y + 3 * h / 16);
    p5.vertex(x + 4 * w / 16, y + 3 * h / 16);
    p5.vertex(x + 4 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 3 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 3 * w / 16, y + 5 * h / 16);
    p5.vertex(x + 2 * w / 16, y + 5 * h / 16);
    p5.vertex(x + 2 * w / 16, y + 9 * h / 16);
    p5.vertex(x + 3 * w / 16, y + 9 * h / 16);
    p5.vertex(x + 3 * w / 16, y + 10 * h / 16);
    p5.vertex(x + 4 * w / 16, y + 10 * h / 16);
    p5.vertex(x + 4 * w / 16, y + 11 * h / 16);
    p5.vertex(x + 5 * w / 16, y + 11 * h / 16);
    p5.vertex(x + 5 * w / 16, y + 12 * h / 16);
    p5.vertex(x + 6 * w / 16, y + 12 * h / 16);
    p5.vertex(x + 6 * w / 16, y + 13 * h / 16);
    p5.vertex(x + 7 * w / 16, y + 13 * h / 16);
    p5.vertex(x + 7 * w / 16, y + 14 * h / 16);
    p5.vertex(x + 8 * w / 16, y + 14 * h / 16);
    p5.vertex(x + 8 * w / 16, y + 15 * h / 16);
    p5.vertex(x + 10 * w / 16, y + 15 * h / 16);
    p5.vertex(x + 10 * w / 16, y + 14 * h / 16);
    p5.vertex(x + 11 * w / 16, y + 14 * h / 16);
    p5.vertex(x + 11 * w / 16, y + 13 * h / 16);
    p5.vertex(x + 12 * w / 16, y + 13 * h / 16);
    p5.vertex(x + 12 * w / 16, y + 12 * h / 16);
    p5.vertex(x + 13 * w / 16, y + 12 * h / 16);
    p5.vertex(x + 13 * w / 16, y + 11 * h / 16);
    p5.vertex(x + 14 * w / 16, y + 11 * h / 16);
    p5.vertex(x + 14 * w / 16, y + 10 * h / 16);
    p5.vertex(x + 15 * w / 16, y + 10 * h / 16);
    p5.vertex(x + 15 * w / 16, y + 9 * h / 16);
    p5.vertex(x + 16 * w / 16, y + 9 * h / 16);
    p5.vertex(x + 16 * w / 16, y + 5 * h / 16);
    p5.vertex(x + 15 * w / 16, y + 5 * h / 16);
    p5.vertex(x + 15 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 14 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 14 * w / 16, y + 3 * h / 16);
    p5.vertex(x + 10 * w / 16, y + 3 * h / 16);
    p5.vertex(x + 10 * w / 16, y + 4 * h / 16);
    p5.vertex(x + 8 * w / 16, y + 4 * h / 16);
    p5.endShape(p5.CLOSE);
  }
}

export default function P5Canvas() {
  return (
    <>
        <ReactP5Wrapper sketch={sketch} />
    </>
  );
}
