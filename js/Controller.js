var COMPARISON_VIEW = false;
var START_BAR_CHART;
var END_BAR_CHART;
var USER;
var BAR_CHART_PATH;
var RADAR_CHART_PATH;
var WORD_EMOJI_CHART_PATH;

$(document).ready(function() {
  $('#user_select_button').click(function() {
    $('ul').toggleClass('nav_active');
    $('ul').toggleClass('nav_inactive');
  });

  let user = $('#user').attr('class');

  switch (user) {
    case "b1":
      BAR_CHART_PATH = "data/GDV-Bar-Chart-Data-B1.json";
      RADAR_CHART_PATH = "data/GDV-Circular-Area-Chart-Data-B1.json";
      WORD_EMOJI_CHART_PATH = "data/GDV-Words-Data-B1.json";
      break;

    case "b2":
      BAR_CHART_PATH = "data/GDV-Bar-Chart-Data-B2.json";
      RADAR_CHART_PATH = "data/GDV-Circular-Area-Chart-Data-B2.json";
      WORD_EMOJI_CHART_PATH = "data/GDV-Words-Data-B2.json";
      break;

    case "b3":
      BAR_CHART_PATH = "data/GDV-Bar-Chart-Data-B3.json";
      RADAR_CHART_PATH = "data/GDV-Circular-Area-Chart-Data-B3.json";
      WORD_EMOJI_CHART_PATH = "data/GDV-Words-Data-B3.json";
      break;
  }
  
  setup_total_corona_word_count();
  generate_bar_chart();
  generate_word_chart();
  generate_donut_chart();
  generate_circular_area_chart(false);
});

function generate_bar_chart() {
  d3.json(BAR_CHART_PATH, function(error, data) {
    if (error) throw error;

    let height = $('.bar_chart').height();
    let width = $('.bar_chart').width();
    let offset = width / data.length;
    let barWidth = offset - 3;

    let y = d3.scale.linear()
            .range([height, 0]);
            
    let svg = d3.select(".bar_chart");

    y.domain([0, d3.max(data, function(d) { return d.anzahl; })]);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return d.datum; })
        .attr("width", barWidth)
        .attr("value", function(d) { return d.anzahl; })
        .attr("word_count", function(d) { return d.woerterAnEinemTag; })
        .style("transform", function(d, i) { return "translateX(" + (i * offset) + "px)"})
        .attr("y", function(d) { return y(d.anzahl); });

    let animation_offset = 0;

    $('.bar').each(function() {
      $(this).delay(animation_offset).animate({height: height - $(this).attr('y')}, 80);
      animation_offset += 10;
    });

    // fill message data to total overview
    let message_counter = 0;
    let word_counter = 0;
    let day_counter = 0;

    data.forEach(function(d) {
      message_counter += d.anzahl;
      word_counter += d.woerterAnEinemTag;
      day_counter += 1;
    });

    let avg_messages_per_day = (message_counter / day_counter).toFixed(0);
    let avg_words_per_day = (word_counter / day_counter).toFixed(0);

    fill_overview_messages(message_counter, word_counter, avg_messages_per_day, avg_words_per_day, day_counter);

    bar_hover(offset);
    set_mondays(offset);

    // creating moving average line
    let moving_avg_data = []
    let index = 0;

    for (var i = 0; i < data.length; i++) {
      if (i > 2 && i < data.length - 3) {
        for (var j = i + 3; j >= i - 3; j--) {
          if (moving_avg_data[index] == null) {
            moving_avg_data[index] = data[j].anzahl;
          } else {
            moving_avg_data[index] += data[j].anzahl;
          }
        }
        moving_avg_data[index] = parseFloat((moving_avg_data[index] / 7).toFixed(2));
        index++;
      }
    }

    index = 0;

    moving_avg_data = moving_avg_data
      .map(function(d) {
        return {index: index++, value: d}
      });

    let x = d3.scale.linear()
            .range([0, width - offset * 7]);

    x.domain([0, d3.max(moving_avg_data, function(d) { return d.index; })]);

    svg.append("path")
      .datum(moving_avg_data)
      .attr("fill", "none")
      .attr("class", "moving_avg_line")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .attr("d", d3.svg.line()
        .x(function(d) { return x(d.index) })
        .y(function(d) { return y(d.value) })
        )
      .style("transform", function() { return "translateX(" + 3.5 * offset + "px)"});

    $('.moving_avg_line').delay($('.bar').length * 10 + 250).animate({opacity: "1"}, 500);

    // setting up drag and drop
    drag_and_drop(offset);
  });
}

function set_mondays() {
  const MONDAYS = ["3.2.2020", "10.2.2020", "17.2.2020", "24.2.2020", "2.3.2020", "9.3.2020", "16.3.2020", "23.3.2020", "30.3.2020", "6.4.2020", "13.4.2020", "20.4.2020", "27.4.2020", "4.5.2020", "11.5.2020", "18.5.2020", "25.5.2020"];
  let bars = $('.bar');
  let counter = 1;

  bars.each(function() {
    let id = this.id
    if (jQuery.inArray(id, MONDAYS) != -1) {
      $(this).addClass('monday');
    }

    if (counter < 47) {
      $(this).addClass('bar_active');
      counter++;
    }

    if (id === "18.3.2020") {
      $(this).addClass('merkel_redet');
    }
  })

  let mondays = $('.monday');
  let monday_markers = $('.monday_marker');

  for (var i = 0; i < mondays.length; i++) {
    let transform = $(mondays[i]).css("transform");

    $(monday_markers[i]).css("transform", transform);
  }
}

function drag_and_drop(offset) {
  let start_position_left = $('.bar_active:first-child').position().left + offset / 2;
  START_BAR_CHART = start_position_left;
  let start_position_right = START_BAR_CHART + offset * 45;
  END_BAR_CHART = start_position_left + parseInt($('.bar').last().css("transform").split(/[()]/)[1].split(',')[4]);
  $('#drag_left').css("left", start_position_left + "px");
  $('#drag_right').css("left", start_position_right + "px");

  $('#drag_left').children('p').text($('.bar:first-child').attr('id'));
  $('#drag_right').children('p').text($('.bar:last-child').attr('id'));

  $('.draggable').draggable({
    grid: [ offset , 0 ],
    start: function() {
      $(this).animate({opacity: '0.65'}, 250);
    },
    drag: function() {
      let slider = $(this);
      let slider_position = $(slider)[0].getBoundingClientRect().left + offset;
      let pos_min = slider_position - 10;
      let pos_max = slider_position + 10;

      let area_start = $('#drag_left')[0].getBoundingClientRect().left;
      let area_end = $('#drag_right')[0].getBoundingClientRect().left + offset;

      $('.bar').each(function() {
        let bar_position = $(this).position().left;

        if (bar_position >= pos_min && bar_position <= pos_max) {
          $(slider).children('p').text($(this).attr('id'));
        }

        if (bar_position >= area_start && bar_position <= area_end) {
          $(this).addClass('bar_active');
        } else {
          $(this).removeClass('bar_active');
        }

        if (COMPARISON_VIEW) {
          let area_compare_start = $('#drag_left_compare')[0].getBoundingClientRect().left;
          let area_compare_end = $('#drag_right_compare')[0].getBoundingClientRect().left + offset;

          if (bar_position >= area_compare_start && bar_position <= area_compare_end) {
            $(this).addClass('bar_active_compare');
          } else {
            $(this).removeClass('bar_active_compare');
          }
        }
        update_overview();
      });
    },
    stop: function() {
       $(this).animate({opacity: '1'}, 250);

       if (COMPARISON_VIEW) {
        generate_circular_area_chart(true);
        generate_comparison_word_chart();
        generate_comparison_donut_chart();
       } else {
        generate_circular_area_chart(false);
        generate_word_chart();
        generate_donut_chart();
       }
       update_drag_boxes();
    }
  });

  sleep(2000).then(function() {
    update_drag_boxes();
  });

  $('#drag_left').draggable({
    containment: $('#drag_box_green_left')
  });

  $('#drag_right').draggable({
    containment: $('#drag_box_green_right')
  });

  $('#drag_left_compare').draggable({
    containment: $('#drag_box_blue_left')
  });

  $('#drag_right_compare').draggable({
    containment: $('#drag_box_blue_right')
  });
}

function update_drag_boxes() {
  let bars = $('.bar');
  let offset = $('.bar_chart').width() / bars.length;

  let drag_box_green_left = $('#drag_box_green_left');
  let drag_box_green_right = $('#drag_box_green_right');

  let drag_box_blue_left = $('#drag_box_blue_left');
  let drag_box_blue_right = $('#drag_box_blue_right');

  let left_outer_position = parseInt($('.bar_chart').css("padding-left").replace("px", "")) + offset * 4.5 + $('#overview').width();
  let right_outer_position = parseInt($('.bar_chart').css("padding-left").replace("px", "")) + offset * 5.5 + $('#overview').width() + $('.bar_chart').width();

  if (COMPARISON_VIEW) {
    var left_outer_bar_position_green = $('.bar_active').first()[0].getBoundingClientRect().left;
    var right_outer_bar_position_green = $('.bar_active').last()[0].getBoundingClientRect().left;

    var left_outer_bar_position_blue = $('.bar_active_compare').first()[0].getBoundingClientRect().left;
    var right_outer_bar_position_blue = $('.bar_active_compare').last()[0].getBoundingClientRect().left;

    var width_green_left = right_outer_bar_position_green - left_outer_position;
    var width_green_right = left_outer_bar_position_blue - left_outer_bar_position_green + offset / 2;

    var width_blue_left = right_outer_bar_position_blue - right_outer_bar_position_green + offset;
    var width_blue_right = right_outer_position - left_outer_bar_position_blue + offset * 2;

    $(drag_box_green_left).width(width_green_left);
    $(drag_box_green_right).width(width_green_right);

    $(drag_box_blue_left).width(width_blue_left);
    $(drag_box_blue_right).width(width_blue_right);

    $(drag_box_green_left).css('left', left_outer_position + offset);
    $(drag_box_green_right).css('left', left_outer_bar_position_green);

    $(drag_box_blue_left).css('left', right_outer_bar_position_green);
    $(drag_box_blue_right).css('left', left_outer_bar_position_blue);
  } else {
    var left_outer_bar_position_green = $('.bar_active').first()[0].getBoundingClientRect().left;
    var right_outer_bar_position_green = $('.bar_active').last()[0].getBoundingClientRect().left;

    var width_left = right_outer_bar_position_green - left_outer_position;
    var width_right = right_outer_position - left_outer_bar_position_green + offset * 2;

    $(drag_box_green_left).width(width_left);
    $(drag_box_green_left).css('left', left_outer_position + offset);

    $(drag_box_green_right).width(width_right);
    $(drag_box_green_right).css('left', left_outer_bar_position_green);
  }
}

function fill_overview_messages(message_counter, word_counter, avg_messages_per_day, avg_words_per_day, total_days) {
  $('#total_messages').text(message_counter);
  $('#total_words').text(word_counter);
  $('#avg_messages').text(avg_messages_per_day);
  $('#avg_words').text(avg_words_per_day);

  $('#total_messages_green').text(message_counter);
  $('#total_words_green').text(word_counter);
  $('#avg_messages_green').text(avg_messages_per_day);
  $('#avg_words_green').text(avg_words_per_day);

  $('#total_days').text(total_days);
  $('#days_green').text(total_days);

  $('.count').each(function () {
    let $this = $(this);
    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
      duration: $('.bar').length * 10 + 100,
      easing: 'swing',
      step: function () {
        $this.text(Math.ceil(this.Counter));
      }
    });
  });

  $('.count_avg').each(function () {
    let $this = $(this);
    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
      duration: $('.bar').length * 10 + 100,
      easing: 'swing',
      step: function () {
        $this.text(this.Counter.toFixed(0));
      }
    });
  });
}

function bar_hover(offset) {
  let bar_info = $('#bar_info');
  let bar_info_offset = parseInt($('.bar_chart').css("padding-left").replace("px", "")) + offset * 1.35 + $('#overview').width();
  $(bar_info).css("left", bar_info_offset + "px");

  $('.bar').each(function() {
    $(this).hover(
      function() {
        $(bar_info).css("transform", $(this).css("transform"));
        $(bar_info).css("top", ($('.bar_chart').position().top + $('.bar_chart').height() - 80 - $(this).height()) + "px");
        $(bar_info).text($(this).attr('value'));
        $(bar_info).css("opacity", "1");
        $('.bar').each(function() {
          $(this).css("opacity", "0.15");
        });
        $(this).css("opacity", "1");
      }, function() {
        $(bar_info).css("opacity", "0");
        $('.bar').each(function() {
          $(this).css("opacity", "0.4");
          if ($(this).hasClass('merkel_redet')) {
            $(this).css("opacity", "1");
          }
        });
      });
  });
}

function switch_view() {
  COMPARISON_VIEW = (COMPARISON_VIEW) ? false : true;
  let bars = $('.bar');
  let offset = $('.bar_chart').width() / bars.length;

  if (COMPARISON_VIEW) {
    let start_position_left = START_BAR_CHART;
    let start_position_right = START_BAR_CHART + 45 * offset;
    let start_position_compare_left = START_BAR_CHART + 47 * offset;
    let start_position_compare_right = END_BAR_CHART;

    $('#drag_left').css("left", start_position_left + "px");
    $('#drag_right').css("left", start_position_right + "px");

    $('#drag_left_compare').css("left", start_position_compare_left + "px");
    $('#drag_right_compare').css("left", start_position_compare_right + "px");

    $('#drag_left_compare').show();
    $('#drag_right_compare').show();

    let area_start = $('#drag_left')[0].getBoundingClientRect().left;
    let area_end = $('#drag_right')[0].getBoundingClientRect().left + offset;
    let area_compare_start = $('#drag_left_compare')[0].getBoundingClientRect().left;
    let area_compare_end = $('#drag_right_compare')[0].getBoundingClientRect().left + offset;

    bars.each(function() {
      let bar_position = $(this).position().left;

      if (bar_position >= area_start && bar_position <= area_end) {
        $(this).addClass('bar_active');
        $(this).removeClass('bar_active_compare');
      } else if (bar_position >= area_compare_start && bar_position <= area_compare_end) {
        $(this).addClass('bar_active_compare');
        $(this).removeClass('bar_active');
      } else {
        $(this).removeClass('bar_active_compare');
        $(this).removeClass('bar_active');
      }
    });

    $('#drag_left').children('p').text($('.bar_active').first().attr('id'));
    $('#drag_right').children('p').text($('.bar_active').last().attr('id'));
    $('#drag_left_compare').children('p').text($('.bar_active_compare').first().attr('id'));
    $('#drag_right_compare').children('p').text($('.bar_active_compare').last().attr('id'));

    generate_circular_area_chart(true);
    generate_comparison_word_chart();
    generate_comparison_donut_chart();
    update_overview();
    update_drag_boxes();
  } else {
    let start_position_left = START_BAR_CHART;
    let start_position_right = START_BAR_CHART + offset * 45;

    $('#drag_left_compare').hide();
    $('#drag_right_compare').hide();
    $('#drag_left').css("left", start_position_left + "px");
    $('#drag_right').css("left", start_position_right + "px");

    let counter = 1;

    bars.each(function() {
      if (counter < 47) {
        $(this).addClass('bar_active');
        counter++;
      }
      
      $(this).removeClass('bar_active_compare');
    });

    $('#drag_left').children('p').text($('.bar_active').first().attr('id'));
    $('#drag_right').children('p').text($('.bar_active').last().attr('id'));

    generate_circular_area_chart(false);
    generate_word_chart();
    generate_donut_chart();
    update_overview();
    update_drag_boxes();
  }
}

function update_overview() {
  if (COMPARISON_VIEW) {
    let bars_green = $('.bar_active');
    let bars_blue = $('.bar_active_compare');

    let total_words_green = 0;
    let total_words_blue = 0;
    let total_messages_green = 0;
    let total_messages_blue = 0;

    let avg_words_green = 0;
    let avg_words_blue = 0;
    let avg_messages_green = 0;
    let avg_messages_blue = 0;

    let green_days = bars_green.length;
    let blue_days = bars_blue.length;

    bars_green.each(function() {
      total_messages_green += parseInt($(this).attr('value'));
      total_words_green += parseInt($(this).attr('word_count'));
    });

    avg_messages_green = (total_messages_green / green_days).toFixed(0);
    avg_words_green = (total_words_green / green_days).toFixed(0);

    bars_blue.each(function() {
      total_messages_blue +=  parseInt($(this).attr('value'));
      total_words_blue += parseInt($(this).attr('word_count'));
    });

    avg_messages_blue = (total_messages_blue / blue_days).toFixed(0);
    avg_words_blue = (total_words_blue / blue_days).toFixed(0);

    $('#total_messages_green').text(total_messages_green);
    $('#total_messages_blue').text(total_messages_blue);
    $('#total_words_green').text(total_words_green);
    $('#total_words_blue').text(total_words_blue);

    $('#avg_messages_green').text(avg_messages_green);
    $('#avg_messages_blue').text(avg_messages_blue);
    $('#avg_words_green').text(avg_words_green);
    $('#avg_words_blue').text(avg_words_blue);

    $('#total_messages_blue').css('opacity', '1');
    $('#total_words_blue').css('opacity', '1');
    $('#avg_messages_blue').css('opacity', '1');
    $('#avg_words_blue').css('opacity', '1');

    $('#days_blue').css('opacity', '1');
    $('#days_green').text(green_days);
    $('#days_blue').text(blue_days);
  } else {
    let bars_green = $('.bar_active');
    
    let total_words_green = 0;
    let total_messages_green = 0;
    
    let avg_words_green = 0;
    let avg_messages_green = 0;
    
    let green_days = bars_green.length;
    
    bars_green.each(function() {
      total_messages_green += parseInt($(this).attr('value'));
      total_words_green += parseInt($(this).attr('word_count'));
    });

    avg_messages_green = (total_messages_green / green_days).toFixed(0);
    avg_words_green = (total_words_green / green_days).toFixed(0);
    
    $('#total_messages_green').text(total_messages_green);
    $('#total_words_green').text(total_words_green);

    $('#avg_messages_green').text(avg_messages_green);
    $('#avg_words_green').text(avg_words_green);

    $('#total_messages_blue').css('opacity', '0');
    $('#total_words_blue').css('opacity', '0');
    $('#avg_messages_blue').css('opacity', '0');
    $('#avg_words_blue').css('opacity', '0');

    $('#days_green').text(green_days);
    $('#days_blue').css('opacity', '0');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}