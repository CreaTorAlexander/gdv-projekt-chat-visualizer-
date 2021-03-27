let total_emoji_count_green = 0;
let total_emoji_count_blue = 0;

function generate_donut_chart() {
	total_emoji_count_green = 0;
	total_emoji_count_blue = 0;
	
	// delete old charts
	$(".donut_chart").remove();
	$(".donut_chart_comparison_left").remove();
	$(".donut_chart_comparison_right").remove();

	// generate new one
	d3.select("#top_emojis")
		.append("svg")
		.attr("class", "donut_chart")
		.append("g")

	// select new chart
	let svg = d3.select(".donut_chart")

	let width = $('.donut_chart').width()
	let height = $('.donut_chart').height()
	let margin = 5

	let radius = Math.min(width, height) / 2 - margin

	d3.json(WORD_EMOJI_CHART_PATH, function(data) {
	    let active_days = $('.bar_active')

	    for (var i = 0; i < active_days.length; i++) {
	      active_days[i] = $(active_days[i]).attr('id')
	    }
 
	    let emoji_string = ""

	    data.forEach(function(d) {
	    	if (jQuery.inArray(d.datum, active_days) != -1 && d.wort.match(new RegExp(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)) != null) {
	    		for (var i = 0; i < d.anzahl; i++) {
		    		emoji_string += d.wort
		    	}
	    	}
	    })

	    data = []

	    let unique_codes = []

	    for (var i = 0; i < emoji_string.length; i = i + 2) {
	    	var char = emoji_string[i]
	    	if (char.match(new RegExp("[a-züöäß0-9&-+^*:;,.<>!?]")) == null) {
	    		var code = emoji_string.codePointAt(i)
		    	var hex = code.toString(16)
		    	var emoji = String.fromCodePoint("0x" + hex)

		    	if (!(code >= 11000 && code <= 70000)) {
		    		if (data[emoji] == null) {
						data[emoji] = 1
			    	} else {
			    		data[emoji] += 1
			    	}
			    	total_emoji_count_green += 1
		    	}
	    	}
	    }

		let color = d3.scale.ordinal()
	    	.range(["#71FFB6", "#64e0a1", "#3d8463", "#234739", "#162824"])

		let pie = d3.layout.pie()
		 	.value(function(d) {return d.value; })
		
		// sorting by value and seelcting only top 5 entries
		let top_five = d3.entries(data)
			.sort(function(a,b) {return d3.descending(a.value,b.value); })
			.slice(0,5)
		
		let data_ready = pie(top_five)

		svg
		  .selectAll('whatever')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('id', function(d){ return d.data.value })
		  .attr('value', function(d){ return d.data.value })
		  .attr('class', 'donut_chart_element')
		  .attr('d', d3.svg.arc()
		    .innerRadius(radius * 0.65)
		    .outerRadius(radius)
		  )
		  .attr('fill', function(d){ return(color(d.data.key)) })
		  .attr("stroke", "black")
		  .style("stroke-width", "1px")
		  .style("opacity", 0.7)
		  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		var outerArc = d3.svg.arc()
		  .innerRadius(radius * 0.65)
		  .outerRadius(radius)

		svg
		  .selectAll('allLabels')
		  .data(data_ready)
		  .enter()
		  .append('text')
		  .attr('class', 'emoji')
		  .attr('id', function(d) { return d.data.value } )
		    .text( function(d) { return d.data.key } )
		    .each(function(d) {
				var centroid = outerArc.centroid(d);
				d3.select(this)
					.attr('x', centroid[0])
					.attr('y', centroid[1])
					.attr('dy', '0.33em')
					.attr("transform", "translate(" + (width / 2 - 15) + "," + height / 2 + ")")
			})
			.style("font-size", "1vw")
			.style("fill", "white")

		calculate_percentages();
		donut_chart_hover();
	});
}

function generate_comparison_donut_chart() {
	total_emoji_count_green = 0;
	total_emoji_count_blue = 0;

	// delete old charts
	$(".donut_chart").remove();
	$(".donut_chart_comparison_left").remove();
	$(".donut_chart_comparison_right").remove();

	// generate new ones
	d3.select("#top_emojis")
		.append("svg")
		.attr("class", "donut_chart_comparison_left")
		.append("g")

	d3.select("#top_emojis")
		.append("svg")
		.attr("class", "donut_chart_comparison_right")
		.append("g")

	// select new chart
	let svg = d3.select(".donut_chart_comparison_left")
	let svg_comparison = d3.select(".donut_chart_comparison_right")

	let width = $('.donut_chart_comparison_left').width()
	let height = $('.donut_chart_comparison_left').height()
	let margin = 5

	let radius = Math.min(width, height) / 2 - margin

	d3.json(WORD_EMOJI_CHART_PATH, function(data) {
	    let active_days = $('.bar_active')
	    let active_days_comparison = $('.bar_active_compare')

	    for (var i = 0; i < active_days.length; i++) {
	      active_days[i] = $(active_days[i]).attr('id')
	    }

	    for (var i = 0; i < active_days_comparison.length; i++) {
	      active_days_comparison[i] = $(active_days_comparison[i]).attr('id')
	    }

	    let emoji_string = ""
	    let emoji_string_comparison = ""

	    data.forEach(function(d) {
	    	if (d.wort.match(new RegExp(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)) != null) {
	    		for (var i = 0; i < d.anzahl; i++) {
	    			if (jQuery.inArray(d.datum, active_days) != -1) {
	    				emoji_string += d.wort
	    			} else if (jQuery.inArray(d.datum, active_days_comparison) != -1) {
						emoji_string_comparison += d.wort
	    			}
		    	}
	    	}
	    })

	    data = []
	    data_comparison = []

	    for (var i = 0; i < emoji_string.length; i = i + 2) {
	    	var char = emoji_string[i]
	    	if (char.match(new RegExp("[a-züöäß0-9&-+^*:;,.<>!?]")) == null) {
	    		var code = emoji_string.codePointAt(i)
		    	var hex = code.toString(16)
		    	var emoji = String.fromCodePoint("0x" + hex)

		    	if (!(code >= 11000 && code <= 70000)) {
		    		if (data[emoji] == null) {
						data[emoji] = 1
			    	} else {
			    		data[emoji] += 1
			    	}
			    	total_emoji_count_green += 1
		    	}
	    	}
	    }

	    for (var i = 0; i < emoji_string_comparison.length; i = i + 2) {
	    	var char = emoji_string_comparison[i]
	    	if (char.match(new RegExp("[a-züöäß0-9&-+^*:;,.<>!?]")) == null) {
	    		var code = emoji_string_comparison.codePointAt(i)
		    	var hex = code.toString(16)
		    	var emoji = String.fromCodePoint("0x" + hex)

		    	if (!(code >= 11000 && code <= 70000)) {
		    		if (data_comparison[emoji] == null) {
						data_comparison[emoji] = 1
			    	} else {
			    		data_comparison[emoji] += 1
			    	}
			    	total_emoji_count_blue += 1
		    	}
	    	}
	    }

		let color = d3.scale.ordinal()
	    	.range(["#71FFB6", "#64e0a1", "#3d8463", "#234739", "#162824"])

		let pie = d3.layout.pie()
		 	.value(function(d) {return d.value; })
		
		// sorting by value and seelcting only top 5 entries
		let top_five = d3.entries(data)
			.sort(function(a,b) {return d3.descending(a.value,b.value); })
			.slice(0,5)
		
		let data_ready = pie(top_five)

		svg
		  .selectAll('whatever')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('id', function(d){ return d.data.value })
		  .attr('value', function(d){ return d.data.value })
		  .attr('class', 'donut_chart_element donut_chart_element_green')
		  .attr('d', d3.svg.arc()
		    .innerRadius(radius * 0.65)
		    .outerRadius(radius)
		  )
		  .attr('fill', function(d){ return(color(d.data.key)) })
		  .attr("stroke", "black")
		  .style("stroke-width", "1px")
		  .style("opacity", 0.7)
		  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		var outerArc = d3.svg.arc()
		  .innerRadius(radius * 0.65)
		  .outerRadius(radius)

		svg
		  .selectAll('allLabels')
		  .data(data_ready)
		  .enter()
		  .append('text')
		  .attr('class', 'emoji')
		  .attr('id', function(d) { return d.data.value } )
		    .text( function(d) { return d.data.key } )
		    .each(function(d) {
				var centroid = outerArc.centroid(d);
				d3.select(this)
					.attr('x', centroid[0])
					.attr('y', centroid[1])
					.attr('dy', '0.33em')
					.attr("transform", "translate(" + (width / 2 - 15) + "," + height / 2 + ")")
			})
			.style("font-size", "1vw")
			.style("fill", "white")

		let color_comparison = d3.scale.ordinal()
	    	.range(["#93a6ec", "#6a7ec9", "#2c4294", "#021a70", "#00004d"])
		
		// sorting by value and seelcting only top 5 entries
		let top_five_comparison = d3.entries(data_comparison)
			.sort(function(a,b) {return d3.descending(a.value,b.value); })
			.slice(0,5)
		
		let data_ready_comparison = pie(top_five_comparison)

		svg_comparison
		  .selectAll('whatever_comparison')
		  .data(data_ready_comparison)
		  .enter()
		  .append('path')
		  .attr('id', function(d){ return d.data.value })
		  .attr('value', function(d){ return d.data.value })
		  .attr('class', 'donut_chart_element donut_chart_element_blue')
		  .attr('d', d3.svg.arc()
		    .innerRadius(radius * 0.65)
		    .outerRadius(radius)
		  )
		  .attr('fill', function(d){ return(color_comparison(d.data.key)) })
		  .attr("stroke", "black")
		  .style("stroke-width", "1px")
		  .style("opacity", 0.7)
		  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		var outerArc = d3.svg.arc()
		  .innerRadius(radius * 0.65)
		  .outerRadius(radius)

		svg_comparison
		  .selectAll('allLabels_comparison')
		  .data(data_ready_comparison)
		  .enter()
		  .append('text')
		  .attr('class', 'emoji')
		  .attr('id', function(d) { return d.data.value } )
		    .text( function(d) { return d.data.key } )
		    .each(function(d) {
				var centroid = outerArc.centroid(d);
				d3.select(this)
					.attr('x', centroid[0])
					.attr('y', centroid[1])
					.attr('dy', '0.33em')
					.attr("transform", "translate(" + (width / 2 - 15) + "," + height / 2 + ")")
			})
			.style("font-size", "1vw")
			.style("fill", "white")

		calculate_percentages();
		donut_chart_hover();
	});
}

function donut_chart_hover() {
	if (COMPARISON_VIEW) {
	  $('.donut_chart_element').each(function() {
	  	let id = $(this).attr('id');
	    $(this).hover(
	      function() {
	        $('.donut_chart_element').each(function() {
	          $(this).css("opacity", "0.15");
	        });
	        $('.emoji').each(function() {
	        	if ($(this).attr('id') == id) {
	        		$(this).css("opacity", "1");
	        	} else {
	        		$(this).css("opacity", "0.15");
	        	}
	        });
	        $(this).css("opacity", "1");
	        if ($(this).hasClass('donut_chart_element_green')) {
	        	$(donut_chart_info_comparison).text("relativ: " + $(this).attr('id') + " %\nabsolut: " + (($(this).attr('value') / total_emoji_count_green) * 100).toFixed(1) + " %");
	        } else {
	        	$(donut_chart_info_comparison).text("relativ: " + $(this).attr('id') + " %\nabsolut: " + (($(this).attr('value') / total_emoji_count_blue) * 100).toFixed(1) + " %");
	        }
	        $(donut_chart_info_comparison).css("opacity", "1");
	      }, function() {
	        $('.donut_chart_element').each(function() {
	          $(this).css("opacity", "1");
	        });
	        $('.emoji').each(function() {
	          $(this).css("opacity", "1");
	        });
	        $(donut_chart_info_comparison).css("opacity", "0");
	      });
	  });
	} else {
	  $('.donut_chart_element').each(function() {
	  	let id = $(this).attr('id');
	    $(this).hover(
	      function() {
	        $('.donut_chart_element').each(function() {
	          $(this).css("opacity", "0.15");
	        });
	        $('.emoji').each(function() {
	        	if ($(this).attr('id') == id) {
	        		$(this).css("opacity", "1");
	        	} else {
	        		$(this).css("opacity", "0.15");
	        	}
	        });
	        $(this).css("opacity", "1");
	        $(donut_chart_info).text("relativ: " + $(this).attr('id') + " %\nabsolut: " + (($(this).attr('value') / total_emoji_count_green) * 100).toFixed(1) + " %");
	        $(donut_chart_info).css("opacity", "1");
	      }, function() {
	        $('.donut_chart_element').each(function() {
	          $(this).css("opacity", "1");
	        });
	        $('.emoji').each(function() {
	          $(this).css("opacity", "1");
	        });
	        $(donut_chart_info).css("opacity", "0");
	      });
	  });
	}
}

function calculate_percentages() {
	if (COMPARISON_VIEW) {
		let left_chart_elements = $(".donut_chart_comparison_left .donut_chart_element");
		let right_chart_elements = $(".donut_chart_comparison_right .donut_chart_element");

		let left_total = 0;
		let right_total = 0;

		left_chart_elements.each(function() {
			left_total += parseInt($(this).attr('id'));
		});

		right_chart_elements.each(function() {
			right_total += parseInt($(this).attr('id'));
		});

		left_chart_elements.each(function() {
			var old_id = $(this).attr('id');
			$(this).attr('id', function() {
				return ((old_id / left_total) * 100).toFixed(1);
			});

			$('#' + old_id).attr('id', $(this).attr('id'));
		});

		right_chart_elements.each(function() {
			var old_id = $(this).attr('id');
			$(this).attr('id', function() {
				return ((old_id / right_total) * 100).toFixed(1);
			});

			$('#' + old_id).attr('id', $(this).attr('id'));
		});
	} else {
		let chart_elements = $(".donut_chart_element");
		
		let total = 0;

		chart_elements.each(function() {
			total += parseInt($(this).attr('id'));
		});

		chart_elements.each(function() {
			var old_id = $(this).attr('id');
			$(this).attr('id', function() {
				return ((old_id / total) * 100).toFixed(1);
			});

			$('#' + old_id).attr('id', $(this).attr('id'));
		});
	}
}