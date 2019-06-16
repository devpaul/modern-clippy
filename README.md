# Modern Clippy

Inspired by [Smore's ClippyJS](https://www.smore.com/clippy-js)

Modern Clippy is a reimplementation of Clippy using Web Components

# Component APIs

# Attributes

* `mute` if sound is muted

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

* load(config: AgentConfiguration);
	* loads an AgentConfiguration
* play(name: string)
	* play a specific action
* playIdle()
	* play a random idle animation
* stop()
	* exit gracefully from the current animation
* stopImmediately()
	* exit immediately from the current animation and return to idle

### Speech Functions

* say(string);
	* shows a speech bubble with the provided string
* sayChoices(... string);
	* gives a list of choices for the user to select from
* sayQuestion(string, ... responses: string);
	* shows a speech bubble with text and a list of single word responses
* silence()
	* closes any open dialog

## Slots

* `dialog` slots into the speech bubble
	* The dialog slot overrides any current speech being shown
