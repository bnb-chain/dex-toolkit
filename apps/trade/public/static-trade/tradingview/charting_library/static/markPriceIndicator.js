__customIndicators = [
  {
    name: "MarkPrice",
    metainfo: {
      _metainfoVersion: 40,
      id: "MarkPrice@tv-basicstudies-1",
      scriptIdPart: "",
      name: "MarkPrice",
      description: "MarkPrice",
      shortDescription: "MarkPrice",

      is_hidden_study: false,
      is_price_study: true,
      isCustomIndicator: true,

      plots: [{ id: "plot_0", type: "line", offset: -9999 }],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: true,

            linewidth: 2,

            plottype: 2,

            trackPrice: true,

            transparency: 0,

            color: "#0000FF"
          }
        },

        precision: 2,

        inputs: {
          in_0: "close"
        }
      },
      styles: {
        plot_0: {
          title: "Price",
          histogramBase: 0
        }
      },
      inputs: [
        {
          id: "in_0",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"]
        }
      ]
    },

    constructor: function() {
      this.init = function(context, inputCallback) {
        this._context = context;
        this._input = inputCallback;
      };

      this.main = function(context, inputCallback) {
        const source = this._input(0);
        this._context = context;
        this._input = inputCallback;
        return PineJS.Std[source](this._context);
      };
    }
  }
];
