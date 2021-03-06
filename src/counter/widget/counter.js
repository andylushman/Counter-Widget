/*global logger*/
/*
    counter
    ========================

    @file      : counter.js
    @version   : 1.0.0
    @author    : Andy Lushman
    @date      : 11/28/2017
    @copyright : TimeSeries 2017
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "counter/lib/jquery-1.11.2",
    "dojo/text!counter/widget/template/counter.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";

    var $ = _jQuery.noConflict(true);

    // Declare widget's prototype.
    return declare("counter.widget.counter", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        //Listed as a reminder for data-dojo-attach-points. Not needed.
        playerOneNameNode: null,
        playerTwoNameNode: null,
        //Used for counters
        _i: 0,
        _i2: 0,

        // Parameters configured in the Modeler. Listed for a reminder not needed.
        playerOneName: "",
        playerTwoName: "",
        mfToExecute: "",
        scoreAttr: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
          _contextObj: null,



        /********************
         TEMPLATE FUNCTIONS
        ********************/

        _setupEvents: function () {
            logger.debug(this.id + "._setupEvents");
            console.log("setupEvents function");
        },

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
            console.log("constructor function");
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate function");
            console.log("postCreate function");

            //Get Value of the playerOneName attribute

            //Putting a string message into the dom
            dojoHtml.set(this.playerOneNameNode, this.playerOneName);
            // dojoHtml.set(this.playerTwoNameNode, this.playerTwoName);


            //Putting style on a dom onject
            // dojoStyle.set(this.counter, {
            //   "background-color": "blue"
            // });
        },

        //Needed to update this._contextObj so that its not null and therefore I can call a microflow in _execMf()
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            console.log("Update function");
            this._contextObj = obj;
            callback();
            this.setName()

        },

        setName: function (){
          mx.data.get({
            guid: this._contextObj.getGuid(),
            callback: function(obj) {
              var player = obj.jsonData.attributes.Name.value;
              console.log(obj);
              dojoHtml.set("playerOne", player);
            }
          });
        },

        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },



      /********************
         BUTTON FUNCTIONS  Listed in HTML as data-dojo-attach-event
      ********************/

        //Player 1
        incrementP1: function(){
          this._i++
          this.counterP1.innerHTML = this._i;

          this.increaseMendixScore();
        },

        decrementP1: function () {
          this._i--
          this.counterP1.innerHTML = this._i;
        },

        resetP1: function(){
          this._i = 0;
          this.counterP1.innerHTML = this._i;
        },

        //Player 2
        incrementP2: function(){
          this._i2++
          this.counterP2.innerHTML = this._i2;
        },

        decrementP2: function () {
          this._i2--
          this.counterP2.innerHTML = this._i2;
        },

        resetP2: function(){
          this._i2 = 0;
          this.counterP2.innerHTML = this._i2;
        },

        increaseMendixScore: function (){
          // If a microflow has been set execute the microflow on a click.
          if (this.mfToExecute !== "") {
              this._execMf(this.mfToExecute, this._contextObj.getGuid());
          }
        }

    });
});

require(["counter/widget/counter"]);
