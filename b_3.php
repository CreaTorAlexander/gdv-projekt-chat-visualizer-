<!DOCTYPE html>
<html lang="de">
<head>
	<title>WhatsApp Chat Visualisierer - B_3</title>
	<link rel="shortcut icon" type="image/png" href="images/favicon.png">
	<!-- CSS --> 
	<link rel="stylesheet" type="text/css" href="css/index.css">
	<link href="https://fonts.googleapis.com/css2?family=Anton&family=Roboto&display=swap" rel="stylesheet"> 
	<!-- JS -->
	<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<script src="js/d3/d3.js"></script>
	<script src="js/d3.layout.cloud.js"></script>
	<script src="js/word_chart.js"></script>
	<script src="js/donut_chart.js"></script>
	<script src="js/circular_area_chart.js"></script>
	<script src="js/Controller.js"></script>
	<!-- META-TAGS -->
	<meta charset="UTF-8" name="viewport" content="width=device-width,
	initial-scale=1.0">
	<meta name="description" content="...">
	<meta name="keywords" content="...">
</head>
<body>
	<div id="content">
		<div id="heading" class="top_level_box">
			<h1 id="heading_1">WHATSAPP CHAT</h1>
			<h1 id="heading_2">VISUALISIERER</h1>
		</div>

		<div id="user_selection" class="top_level_box">
			<h1 id="user_selection_heading">BENUTZER</h1>
			<button id="user_select_button"><img src="graphics/arrow.png"></button>
			<h1 id="user" class="b3">B_3</h1>
			<ul class="nav_inactive">
				<li><a href="b_1.php">B_1</a></li>
				<li><a href="b_2.php">B_2</a></li>
			</ul>
		</div>

		<div id="overview" class="top_level_box">
			<div id="total_overview">
				<table>
					<thead>
						<tr><td colespan="2" class="table_heading">Gesamtüberblick</td></tr>
					</thead>
					<tbody>
						<tr><td>Nachrichten</td><td id="total_messages" class="count">0</td><td id="total_messages_green" class="count">0</td><td id="total_messages_blue" class="count">0</td></tr>
						<tr><td>Wörter</td><td id="total_words" class="count">0</td><td id="total_words_green" class="count">0</td><td id="total_words_blue" class="count">0</td></tr>
						<tr><td>Anzahl Tage</td><td id="total_days" class="count">0</td><td id="days_green" class="count">0</td><td id="days_blue" class="count">0</td></tr>
					</tbody>
				</table>
			</div>

			<div id="avg_overview">
				<table>
					<thead>
						<tr><td colespan="2" class="table_heading">Tagesdurchschnitt</td></tr>
					</thead>
					<tbody>
						<tr><td>Nachrichten</td><td id="avg_messages" class="count_avg">0</td><td id="avg_messages_green" class="count_avg">0</td><td id="avg_messages_blue" class="count_avg">0</td></tr>
						<tr><td>Wörter</td><td id="avg_words" class="count_avg">0</td><td id="avg_words_green" class="count_avg">0</td><td id="avg_words_blue" class="count_avg">0</td></tr>
					</tbody>
				</table>
			</div>
		</div>

		<div id="controll_panel" class="top_level_box">
			<div id="legend"><span></span><p>Merkels Ansprache</p></div>
			<p id="switch_text">Zeiten vergleichen</p>
			<label class="switch">
		  		<input type="checkbox" onclick="switch_view()" id="switch_b">
		  		<span class="slider round"></span>
			</label>

			<svg class="bar_chart">
				<div id="bar_info">lorem</div>
			</svg>

			<div class="draggable draggable_green" id="drag_left">
				<img src="graphics/whatsapp_green.png">
				<p class="draggable_bottom_text">01.02.2020</p>
			</div>

			<div class="draggable draggable_green" id="drag_right">
				<img src="graphics/whatsapp_green.png">
				<p class="draggable_top_text">17.3.2020</p>
			</div>

			<div class="draggable draggable_blue" id="drag_left_compare">
				<img src="graphics/whatsapp_blue.png">
				<p class="draggable_bottom_text">01.01.1970</p>
			</div>

			<div class="draggable draggable_blue" id="drag_right_compare">
				<img src="graphics/whatsapp_blue.png">
				<p class="draggable_top_text">01.01.1970</p>
			</div>

			<div id="drag_box_green_left" class="drag_box"></div>

			<div id="drag_box_green_right" class="drag_box"></div>

			<div id="drag_box_blue_left" class="drag_box"></div>

			<div id="drag_box_blue_right" class="drag_box"></div>

			<div id="monday_markers">
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
				<span class="monday_marker"><span class="monday_marker_line"></span><p>Mo</p></span>
			</div>
		</div>

		<div id="diagrams">
			<div id="top_words" class="top_level_box">
				<h2>VERWENDUNG VON CORONA-BUZZWORDS</h2>
				<ol class="wordcloud_words">
					<li>Arbeit</li>
					<li>Corona</li>
					<li>einkaufen</li>
					<li>gesund</li>
					<li>Hochschule</li>
					<li>online</li>
					<li>Sport</li>
					<li>treffen</li>
					<li>Virus</li>
					<li>zuhause</li>
				</ol>
				<svg class="wordcloud"></svg>
				<div id="corona_words_info">lorem</div>
			</div>

			<div id="top_emojis" class="top_level_box">
				<h2>DIE TOP 5 EMOJIS IM VERHÄLTNIS</h2>
				<svg class="donut_chart"></svg>
				<div id="donut_chart_info">lorem</div>
				<div id="donut_chart_info_comparison">lorem</div>
			</div>

			<div id="daily_activity" class="top_level_box">
				<h2>DURCHSCHNITTLICHE TAGESAKTIVITÄT</h2>
				<svg class="radar_chart"></svg>
			</div>
		</div>
	</div>
</body>
</html>