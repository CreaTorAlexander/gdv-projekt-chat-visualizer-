function generate_circular_area_chart(comparison_view) {
	// generating chart
	let features = [];
	for (var i = 24; i > 0; i--) {
		if (i == 24) {
			features.push(0);
		} else {
			features.push(i);
		}
	}

	// delete old chart
	$(".radar_chart").remove();

	// generate new one
	d3.select("#daily_activity")
		.append("svg")
		.attr("class", "radar_chart");

	// select new chart
	let svg = d3.select(".radar_chart");

	let width = $('.radar_chart').width();
	let height = $('.radar_chart').height();

	// reading data and generating path
	d3.json(RADAR_CHART_PATH, function(error, data) {
		// generate the data
		let active_days = $('.bar_active');
		
		for (var i = 0; i < active_days.length; i++) {
			active_days[i] = $(active_days[i]).attr('id');
		}

		let message_counts = [];
		let day_counts = [];

		let day_counts_2 = [];
		let messages_2 = [];

		let messages = [];

		for (var i = 0; i < 24; i++) {
			messages[i] = 0;
			day_counts[i] = 0;
		}

		data.forEach(function(data) {
			if (jQuery.inArray(data.date, active_days) != -1) {
				if (data.count > 0) {
					messages[parseInt(data.hour)] += data.count;
					day_counts[parseInt(data.hour)] += 1;	
				}
			}
		});

		let divider_1 = day_counts.reduce(function(a, b) {
  			return Math.max(a, b);
		});

		let divider_2 = 0;

		// generate another set of data if comparison mode is active
		if (comparison_view == true) {
			let active_days = $('.bar_active_compare');
		
			for (var i = 0; i < active_days.length; i++) {
				active_days[i] = $(active_days[i]).attr('id');
			}

			for (var i = 0; i < 24; i++) {
				messages_2[i] = 0;
				day_counts_2[i] = 0;
			}

			data.forEach(function(data) {
				if (jQuery.inArray(data.date, active_days) != -1) {
					messages_2[parseInt(data.hour)] += data.count;
					if (data.count > 0) {
						day_counts_2[parseInt(data.hour)] += 1;	
					}
				}
			});

			divider_2 = day_counts_2.reduce(function(a, b) {
	  			return Math.max(a, b);
			});
		}

		let max_value = 0;

		for (var i = 0; i < 24; i++) {
			if (messages[i] != 0) {
				messages[i] = messages[i]/divider_1;
			}

			if (messages[i] > max_value) {
				max_value = messages[i]
			}

			if (messages_2[i] != 0) {
				messages_2[i] = messages_2[i]/divider_2;
			}

			if (messages_2[i] > max_value) {
				max_value = messages_2[i]
			}
		}

		message_counts.push(messages);
		message_counts.push(messages_2);

		let radialScale = d3.scale.linear()
	    	.domain([0,max_value])
	    	.range([0,width / 2.5]);
		let ticks = [max_value/5,(max_value/5) * 2,(max_value/5) * 3,(max_value/5) * 4,max_value];

		ticks.forEach(t =>
	    	svg.append("circle")
	    		.attr("cx", width/2)
	    		.attr("cy", height/2)
	    		.attr("fill", "none")
	    		.attr("stroke", "white")
	    		.attr("r", radialScale(t))
		);

		for (var i = 0; i < features.length; i++) {
		    let ft_name = features[i];
		    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
		    let line_coordinate = angleToCoordinate(angle, max_value);

		    //draw axis line
		    svg.append("line")
		    	.attr("x1", width/2)
		    	.attr("y1", height/2)
		    	.attr("x2", line_coordinate.x)
		    	.attr("y2", line_coordinate.y)
		    	.attr("stroke","white");
		}

		for (var i = 0; i < message_counts.length; i ++) {
			let d = message_counts[i];

			let line = d3.svg.line()
    			.x(d => d.x)
    			.y(d => d.y);

		    let colors = ["#71FFB6", "#6480e4"];
		    let coordinates = getPathCoordinates(d);

		    //draw the path element
		    svg.append("path")
			    .datum(coordinates)
			    .attr("d",line)
			    .attr("stroke-width", 3)
			    .attr("stroke", colors[i])
			    .attr("fill", colors[i])
			    .attr("stroke-opacity", 1)
			    .attr("opacity", 0.5);
		}

		function angleToCoordinate(angle, value){
		    let x = Math.cos(angle) * radialScale(value);
		    let y = Math.sin(angle) * radialScale(value);
		    return {"x": width/2 + x, "y": height/2 - y};
		}

		function getPathCoordinates(data_point){
		    let coordinates = [];
		    for (var i = 0; i < features.length; i++){
		        let ft_name = features[i];
		        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
		        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
		    }
		    return coordinates;
		}
	});
}
