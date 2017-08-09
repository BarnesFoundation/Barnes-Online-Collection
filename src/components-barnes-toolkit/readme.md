The Barnes website is designed to be constructed from many smaller 
[components](#components).

_Like Lego, but for digital content._

It is a design-system rather than say, a traditional website design consisting 
of 100s carefully thought out pages which can't be changed less they become 
brittle and break. Instead we have lots of little components and you can
structure the pages however you want.

![Components](/dist/images/toolkit-structure.png "Components")

*What is a component?*

The idea is if a little group of content could _in theory_ appear on multiple 
pages or even in multiple places on the same page then it should be 
a *component*. 

With these building blocks (or _components_) a developer can create their own 
pages and templates.

This Toolkit provides guidelines on how to do that.

*Responsive by design:*

Components are designed and built to work cross-device and cross-browser

![Components come in 3 different sizes](/dist/images/toolkit-structure-product-quote.png "Components in 3 different sizes")

As you can see from the picture above, the components come in 3 different sizes;
type may be bigger or smaller depending on the size of the screen of the device.
Spacing may also increase or decrease depending upon context of the device size.

In between these 3 sizes the design does it's best to fit. Sometimes this means
a component won't quite work _perfectly_ on a certain screen size but that's okay.
The system tries cater to the majority then do its best for the minority.

*Where is the other content?*

Along with the components you will also need the structural HTML and all the 
assets too.

*Header/Footer files:*

The base HTML e.g. the `<html><head><body>` tags can be found in the 
[Structure component](#structure) further down.
