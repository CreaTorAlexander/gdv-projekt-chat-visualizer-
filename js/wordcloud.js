let corona_words = ["corona", "treffen", "sport", "krank", "online", "abstand", "einkaufen", "zuhause", "oma", "hochschule"];
let total_word_counter = [];

function setup_total_corona_word_count() {
  d3.json(WORD_EMOJI_CHART_PATH, function(data) {
    let word_counter = [];

    corona_words.forEach(function(d) {
      total_word_counter.push(0);
    });

    data.forEach(function(d) {
      if (d.wort.match(new RegExp("^[a-z]*[a-z]$"))) {
        if (jQuery.inArray(d.wort, corona_words) != -1) {
          for (var i = 0; i < d.anzahl; i++) {
            let index = jQuery.inArray(d.wort, corona_words);
            total_word_counter[index] += 1;
          }
        }
      }
    });
  });
}

function generate_wordcloud() {
  // delete old charts
  $(".wordcloud").remove();

  // generate left wordcloud
  d3.select("#top_words")
    .append("svg")
    .attr("class", "wordcloud");

  d3.json(WORD_EMOJI_CHART_PATH, function(data) {
      let active_days = $('.bar_active');

      for (var i = 0; i < active_days.length; i++) {
        active_days[i] = $(active_days[i]).attr('id');
      }

      let word_counter = [];

      corona_words.forEach(function(d) {
        word_counter.push(0);
      });

      data.forEach(function(d) {
        if (jQuery.inArray(d.datum, active_days) != -1 && d.wort.match(new RegExp("^[a-z]*[a-z]$"))) {
          if (jQuery.inArray(d.wort, corona_words) != -1) {
            for (var i = 0; i < d.anzahl; i++) {
              let index = jQuery.inArray(d.wort, corona_words);
              word_counter[index] += 1;
            }
          }
        }
      });

      data_ready = [];

      for (var i = 0; i < word_counter.length; i++) {
        let draw = (total_word_counter[i] != 0);
        data_ready.push({"word": corona_words[i], "count": word_counter[i], "percentage": (word_counter[i] / total_word_counter[i]).toFixed(3), "draw": draw});
      }

      let height = $('.wordcloud').height();
      let width = $('.wordcloud').width();
      let offset = height / data_ready.length;
      let barWidth = offset - 7;

      let y = d3.scale.linear()
              .range([width, 0]);
              
      let svg = d3.select(".wordcloud");

      svg.selectAll(".corona_words_bar_green")
        .data(data_ready)
        .enter().append("rect")
          .attr("class", "corona_words_bar_green corona_words_bar")
          .attr("id", function(d) { return d.word; })
          .attr("height", barWidth)
          .attr("value", function(d) { return (d.percentage * 100).toFixed(1); })
          .style("transform", function(d, i) { return "translateY(" + (i * offset) + "px)"})
          .attr("x", "0")
          .attr("stroke", "black")
          .style("stroke-width", "1px")
          .attr("width", function(d) { 
            if(d.draw == true) {
              return width * d.percentage; 
            }
          });

      svg.selectAll(".corona_words_bar_neutral")
        .data(data_ready)
        .enter().append("rect")
          .attr("class", "corona_words_bar_neutral corona_words_bar")
          .attr("id", function(d) { return d.word; })
          .attr("height", barWidth)
          .attr("stroke", "black")
          .style("stroke-width", "1px")
          .attr("value", function(d) { return ((1 - d.percentage) * 100).toFixed(1); })
          .style("transform", function(d, i) { return "translateY(" + (i * offset) + "px)"})
          .attr("x", function(d) { 
            if(d.draw == true) {
              return width * d.percentage; 
            }
          })
          .attr("width", function(d) { 
            if(d.draw == true) {
              return width - width * d.percentage; 
            }
          });
     corona_words_bar_hover(); 
  });
}

function generate_comparison_wordcloud() {
  // delete old charts
  $(".wordcloud").remove();

  // generate left wordcloud
  d3.select("#top_words")
    .append("svg")
    .attr("class", "wordcloud");

  d3.json(WORD_EMOJI_CHART_PATH, function(data) {
      let active_days = $('.bar_active')
      let active_days_comparison = $('.bar_active_compare')

      for (var i = 0; i < active_days.length; i++) {
        active_days[i] = $(active_days[i]).attr('id')
      }

      for (var i = 0; i < active_days_comparison.length; i++) {
        active_days_comparison[i] = $(active_days_comparison[i]).attr('id')
      }

      let word_counter = [];
      let word_counter_comparison = [];

      corona_words.forEach(function(d) {
        word_counter.push(0);
        word_counter_comparison.push(0);
      });

      data.forEach(function(d) {
        if (jQuery.inArray(d.datum, active_days) != -1 && d.wort.match(new RegExp("^[a-z]*[a-z]$"))) {
          if (jQuery.inArray(d.wort, corona_words) != -1) {
            for (var i = 0; i < d.anzahl; i++) {
              let index = jQuery.inArray(d.wort, corona_words);
              word_counter[index] += 1;
            }
          }
        } else if (jQuery.inArray(d.datum, active_days_comparison) != -1 && d.wort.match(new RegExp("^[a-z]*[a-z]$"))) {
          if (jQuery.inArray(d.wort, corona_words) != -1) {
            for (var i = 0; i < d.anzahl; i++) {
              let index = jQuery.inArray(d.wort, corona_words);
              word_counter_comparison[index] += 1;
            }
          }
        }
      });

      data_ready = [];

      for (var i = 0; i < word_counter.length; i++) {
        let draw = (total_word_counter[i] != 0);
        data_ready.push({"word": corona_words[i], "percentage_green": (word_counter[i] / total_word_counter[i]).toFixed(3), "percentage_blue": (word_counter_comparison[i] / total_word_counter[i]).toFixed(3), "draw": draw});
      }

      console.log(data_ready)

      let height = $('.wordcloud').height();
      let width = $('.wordcloud').width();
      let offset = height / data_ready.length;
      let barWidth = offset - 7;

      let y = d3.scale.linear()
              .range([width, 0]);
              
      let svg = d3.select(".wordcloud");

      svg.selectAll(".corona_words_bar_green")
        .data(data_ready)
        .enter().append("rect")
          .attr("class", "corona_words_bar_green corona_words_bar")
          .attr("id", function(d) { return d.word; })
          .attr("height", barWidth)
          .attr("value", function(d) { return (d.percentage_green * 100).toFixed(1); })
          .style("transform", function(d, i) { return "translateY(" + (i * offset) + "px)"})
          .attr("x", "0")
          .attr("stroke", "black")
          .style("stroke-width", "1px")
          .attr("width", function(d) { 
            if(d.draw == true) {
              return width * d.percentage_green; 
            }
          });

      svg.selectAll(".corona_words_bar_blue")
        .data(data_ready)
        .enter().append("rect")
          .attr("class", "corona_words_bar_blue corona_words_bar")
          .attr("id", function(d) { return d.word; })
          .attr("height", barWidth)
          .attr("stroke", "black")
          .style("stroke-width", "1px")
          .attr("value", function(d) { return (d.percentage_blue * 100).toFixed(1); })
          .style("transform", function(d, i) { return "translateY(" + (i * offset) + "px)"})
          .attr("x", function(d) { 
            if(d.draw == true) {
              return width * d.percentage_green; 
            }
          })
          .attr("width", function(d) { 
            if(d.draw == true) {
              return width * d.percentage_blue; 
            }
          });

      svg.selectAll(".corona_words_bar_neutral")
        .data(data_ready)
        .enter().append("rect")
          .attr("class", "corona_words_bar_neutral corona_words_bar")
          .attr("id", function(d) { return d.word; })
          .attr("height", barWidth)
          .attr("stroke", "black")
          .style("stroke-width", "1px")
          .attr("value", function(d) { return ((1 - d.percentage_green - d.percentage_blue) * 100).toFixed(1); })
          .style("transform", function(d, i) { return "translateY(" + (i * offset) + "px)"})
          .attr("x", function(d) { 
            if(d.draw == true) {
              return width * (parseFloat(d.percentage_green) + parseFloat(d.percentage_blue)); 
            }
          })
          .attr("width", function(d) { 
            if(d.draw == true) {
              return width - width * (parseFloat(d.percentage_green) + parseFloat(d.percentage_blue)); 
            }
          });

      corona_words_bar_hover();
  });
}

function corona_words_bar_hover() {
  let bar_info = $('#corona_words_info');

  $('.corona_words_bar').each(function() {
    $(this).hover(
      function() {
        $(bar_info).css("transform", $(this).css("transform"));
        $(bar_info).text($(this).attr('value') + " %");
        $(bar_info).css("opacity", "1");
        $('.corona_words_bar').each(function() {
          $(this).css("opacity", "0.15");
        });
        $(this).css("opacity", "1");
      }, function() {
        $(bar_info).css("opacity", "0");
        $('.corona_words_bar').each(function() {
          $(this).css("opacity", "1");
        });
      });
  });
}