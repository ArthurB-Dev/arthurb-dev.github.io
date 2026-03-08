---
layout: post
title: I hate water (and water hates me)
description: A breakdown of my first experience with fluid statics and what I have learnt
date: 2026-02-27 14:24 +0100
categories: [Year 1, Thermofluids]
tags: [university, fluid statics, mechanics, maths]
math: true
---


I have always been afraid of the deep dark ocean, especially swimming where I can't see the bottom. Don't get me wrong a love a cheeky dip in the sea in Swansea, but I like how Swansea beaches are flat and touching the bottom is easy. I thought maybe that my hatred of water would slowly decrease with age but thanks to the wonderful world of Fluid Mechanics I can hate it all in a whole new way!

When you decide to take something flat and stick it underwater it's basically the water's job to make sure your structure has the worst time possible. And if we're going to build anything, like a dam or an unnecessarily submerged door, we need to know exactly how hard the water is going to try to destroy it.

People often get this wrong. They think the water just pushes "a bit." No. It has a plan. It's a precise, geometric plan to snap your gate like a dry biscuit.

## Push it real good

Imagine a vertical gate, like a rectangle, blocking some water. We know that the deeper you go, the higher the pressure becomes. This is simple, it's just:

$$
Pressure = \rho g h
$$

This is now engrained in my brain as it is _everywhere_ in thermofluids so get used to it. $$ \rho $$ is the liquids density, $$ g $$ is our good friend gravity, and $$ h $$ is the vertical depth from the water surface.


So we can see that the bottom of the gate is feeling a massive squeeze, while the top is getting a comparatively gentle hug.

This whole pressure situation forms this trapezoid of "push" on the gate. It's not a nice, even squeeze. It’s a lopsided monster. To design the gate, we need to find two crucial pieces of information

 1. The Magnitude : Just how much total force is the water hitting us with?
 2. The Location : Where is that total push concentrated?

## Searching for a squeeze

If you have a trapezoid of force, finding the total force is actually pretty simple. We just assume the entire plate is facing the pressure found right at its centroid, which is just the fancy word for its geometric center.

Think of it this way. The bottom is pushed a lot, and the top is pushed less. The average push, the one that makes everyone happy (except the gate), is right in the middle.

So, the total force, $$F_R$$ (Resultant Force), is:

$$
F_R = (Pressure \ at \ the \ Centroid) \times (Total \ Area)
$$

Where Pressure at the Centroid is just our trusty: $$pgh_C$$ 
($$h_C$$ specifies the depth of the centroid).

> We times by the area because we know that $$ P = \frac{F}{A} $$

You find the middle of the shape, calculate the pressure there, and multiply it by the area. Simples.

## Find the force luke

This is probably one of my favorite parts of this topic, and I have done it wrong so many times it's starting to get embarrassing. The natural assumption for finding the location of the force, is to just say it acts upon the centroid since that's the location we just used to calculate the force.

We would if the pressure was uniform, but thanks to fluids being quirky like that... it’s not there. The pressure at the bottom of the plate is much higher than the pressure at the top. This "lopsided push" forces the actual point of attack downwards, below the centroid. We call this evil point the Center of Pressure, or $y_P$.

Imagine holding a long piece of wood vertically by the very middle. If someone pushes harder on the bottom half than the top half, the whole thing will want to tilt forwards from the bottom. This is exactly what the water is trying to do to your gate.

To find this location, we use a formula that looks like this:

$$ y_P = y_C + \frac{(A \ little \ piece \ of \ magic)}{(y_C \times Area)} $$

Where $y_C$ and $y_P$ are distance down the plane of the centroid and center of pressure respectively.

Ok it's not actually magic, it is $I_{xx,C}$, the Second Moment of Area. This is basically the shape's geometric stubbornness, its resistance to being bent. (Please don't ask me anymore on this I haven't looked any further than that description)

For a rectangle (which is a pretty common one to deal with), this "stubbornness" factor is $\frac{(width \times height^3)}{12}$. Notice how the height is cubed? This means that if you make the gate even a little bit taller, it gets exponentially harder to bend. But it also changes where the water wants to hit it.

So, the Center of Pressure is always deeper than the geometric centroid, because the water is just hitting the bottom harder. The $I_{xx,C}$ is the maths that tells you how far that attack point has migrated downwards.

## Tilting it matrix style

Now, what if your gate isn’t vertical? What if it's slanted, like you're standing straight on a night out? The physics is the same. Pressure still increases linearly with vertical depth ($h$). It doesn't care about your slant.

But to find the location of the center of pressure ($y_P$), we need to use the distance measured along the slant ($y$).

This is where the geometry gets *fun* (if that's even possible). We can't just plug the vertical depth ($h$) into the formulas. You have to convert it using trigonometry using an absolute mechanic classic: $h = y \times sin(\theta)$, where theta is the angle of the incline.

For the force magnitude, we still use the vertical depth to the centroid ($h_C$) since the water only cares about depth.

For the force location, we find the centroid distance along the slant ($y_C$), calculate the second moment of inertia for the slanted rectangle, and then use the formula to find the distance along the slant to the Center of Pressure ($y_P$).

Once you have that $y_P$ distance along the slope, you use trigonometry again to find the actual vertical depth ($h_P$) of where the water is smacking it. It's very  "back-and-forth", but the rules are the same: force is vertical depth, location is slant distance.

## Like it curvy


What if the gate is curved? This is the water's master class. When a surface is curved, the direction of the pressure force changes at every single point on that surface. Trying to find a single, magic point where that mess of forces acts is nightmare fuel.

So, we cheat. Like so many mechanics problems we just split the total force into two simpler components:

  1. Horizontal Force ($F_H$):
  : To find this, we ignore the curve. Get got curve. We take the curved shape and "squash" it flat onto a vertical plane. Imagine looking at it from the side with a flashlight. The shadow it casts is its vertical projection.
  : If you have a quarter-circle gate (radius $R$, width $w$), the shadow it makes is just a flat rectangle ($R$ tall, $w$ wide).
  : We treat this rectangle exactly like our original flat, vertical plate from before. We find the centroid, the average pressure there, and the total area. Bosh! That’s your horizontal force magnitude, and it acts at the $h_P$ we would have calculated for that rectangle.

  1. Vertical Force ($F_V$):
  : This is even more simple (geometrically at least). The vertical force is just the weight of all the fluid (real or imaginary) sitting directly above that curved surface, all the way to the water's surface.
  : So, you calculate the area of the water volume above your curve (like the area of a quarter-circle cross-section). Then you multiply it by the width of the gate to get the total volume. Then you multiply that by the fluid's density and gravity ($mass = volume \times density, weight = mass \times gravity$). That's your total downward vertical push.

This $F_V$ acts right through the centroid of the volume of water. For a quarter-circle, that point is at a horizontal distance of $\frac{4R}{3 \pi}$ from the straight edge, but that's a whole other geometric problem for another day.

You get your final, actual force magnitude ($F_R$) by combining them with Pythagoras: $\sqrt{ (F_H^2 + F_V^2) }$.

## Water you on about

So, wham. That's all for fluid hydrostatic from me today. The water is out to destroy your random wet door (and life), and it does so by pushing harder on the bottom than the top, moving its attack point downwards, and generally making your mind numb.

If you don't calculate the magnitude and, crucially, the precise Center of Pressure, the water will just find the weak spot, exploit the something didn't account for, and enjoy watching you weep.

Keep your centroids in close, but your centers of pressure closer.

A.
