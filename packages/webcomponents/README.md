* The AgentConfiguration describes a specific agent

# Component APIs

## Properties

* `current` READONLY the current animation
* `actions` READONLY a list of available actions

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
* play(name: string)
* playRandom()
* stop()
* stopImmediately()

### Speech Functions

* say(string);
* sayChoices(... string);
* sayQuestion(string, ... responses: string);

## Slots

* `dialog` slots into the speech bubble
