The Barnes UI guide has been built to try to be as accessible as possible given
the restrictions that using third party software inevitably gives. We have tried 
to cover areas such as:

* Keyboard-friendly navigation
* Absence of JavaScript
* Reducing issues with repetitive link copy
* Images
* Heading structure

*Keyboard-friendly navigation:*

The site has been designed so that it can be tabbed through via the keyboard. 
This should aid but visually impaired people (using a screen-reader but not a mouse) 
and motor-impaired people.

A specific case is the main (off-screen) menu.

When the main navigation is active (e.g. visible) then the users can only tab through
links inside the menu. When they reach the last link (whilst tabbing) their
keyboard focus will be sent back to the first link (which the close button)

People who tab are likely to be people with motor impairments who use their
keyboard to navigate the website - instead of a mouse.

If we allow the menu to be tabbable whilst it is not visible - that could be confusing
for motor-impaired users who cannot see the menu and may feel like their keyboard
focus has vanished and if we allow non-menu items to be tabbed to when the menu
is visible then the same problem could occur.

Screen-reader users (e.g. visually-impaired people) may also tab.

*No JavaScript*

The site has been designed to function when JavaScript is not present.

The main navigation is hidden by default and shown by JavaScript when the user 
clicks a button.

In the unlikely event that the user does not have JavaScript in their browser (and that
could happen for _various_ reasons - e.g. a slow internet connection) then this 
nav is visible by default.

*Reducing issues with repetitive link copy*

Quite often, users of screen-readers will have all the links on the active page
read aloud to them. If the links all say the same thing e.g. _Learn more_ or
_Click here_ then those users will not be able to determine where that link goes
and whether or not they should click/tap it.

Please see the section on [accessibility helpers](#accessibility)

*Color contrast*

Please see the section on [colors](#colors)

*Heading order*

Headings e.g. `<h1>` `<h2>` `<h3>` `<h4>` `<h5>` `<h6>` should act like a document
tree for a webpage. The page title should be a `<h1>` and the next level heading 
down should be a `<h2>` and so on and so forth. However, visually we don't always
want it to look that way.

Please see the section on [typography](#typography) and 
[accessibility helpers](#accessibility)

*Buttons versus links*

Our components use `<button>`s as opposed to `<a>` links where appropriate.

Please see the section on [buttons](#btn) for more details.

*Making images accessible with alt text*

Alternative text provides a textual alternative to non-text content in web pages.
it is found in the `alt` attribute inside an `<img>` tag.

If the reason an image has been used to either:
* act as a link
* convey some meaning

then it should have some alt text e.g.
`<a href="http://www.google.com/"><img src="/images/google-logo.png" alt="Google"></a>`

However, if the image is purely decorative then it does not need `alt` text. 

But leaving the `alt` attribute off the `<img>` will cause an error in some cases
where a screen-reader will read out the image file name. That is not helpful 
so in this case, we would use an empty `alt` value:
`<img src="/images/hero-image.png" alt="">`

A good example where we do this is in the [hero component](#hero). Here the image
is being used as a decorative background and is inside a containing `<div>` with
a `<h1>` title which is linked.

The CMS should provide you with the option to add `alt` text and fallback to the
empty `alt` text in right situation.

[Further reading on alt text](http://webaim.org/techniques/alttext/).

