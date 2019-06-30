# Modern Clippy

Inspired by [Smore's ClippyJS](https://www.smore.com/clippy-js)

Modern Clippy is a reimplementation of Clippy using Web Components

![Screenshot](./docs/screenshot.png)

[Try it out now](https://devpaul.github.io/modern-clippy/). API is below. Open the developer console and watch Clippy move!

# Component APIs

# Attributes

* `mute` if sound is muted
* `bundle` loads a json art bundle

## Properties

* `current` READONLY string: the current animation
* `actions` READONLY string[]: a list of available actions

## Events

* `actionStart`
	* identifies when a frame starts
* `frame`
	* provides frame information
	* useful for coordinating dialogs
* `actionEnd`
	* identifies when a frame ends

## Functions

* load(config: AgentConfiguration | string);
	* loads an AgentConfiguration
* play(name: string)
	* play a specific action
* playIdle()
	* play a random idle animation
* stop()
	* exit gracefully from the current animation
* stopImmediately()
	* exit immediately from the current animation and return to idle

## Slots

* `dialog` slots into the speech bubble
	* The dialog slot overrides any current speech being shown
