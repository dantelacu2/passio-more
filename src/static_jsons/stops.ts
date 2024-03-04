// interface BusStop {
//   stop_id: number;
//   stop_code: number;
//   stop_name: string;
//   stop_desc: string;
//   stop_lat: number;
//   stop_lon: number;
//   stop_url: string;
//   location_type: number;
//   stop_timezone: string;
//   wheelchair_boarding: number;
//   platform_code: string;
// }

// const stops: BusStop[] = [
//   {
//     "stop_id": 5036,
//     "stop_code": 5036,
//     "stop_name": "1 Western Ave",
//     "stop_desc": "",
//     "stop_lat": 42.364114,
//     "stop_lon": -71.119075,
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": 58381,
//     "stop_code": 58381,
//     "stop_name": "784 Memorial Drive",
//     "stop_desc": "",
//     "stop_lat": 42.359703,
//     "stop_lon": -71.114945,
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": 63189,
//     "stop_code": 63189,
//     "stop_name": "Barry's Corner (Northbound)",
//     "stop_desc": "",
//     "stop_lat": 42.363958424,
//     "stop_lon": -71.127741708,
//     "stop_url": "", 
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "63190",
//     "stop_code": "63190",
//     "stop_name": "Barry's Corner (Southbound)",
//     "stop_desc": "",
//     "stop_lat": "42.363936034",
//     "stop_lon": "-71.127861727",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "132600",
//     "stop_code": "132600",
//     "stop_name": "Cambridge Common",
//     "stop_desc": "",
//     "stop_lat": "42.376994673",
//     "stop_lon": "-71.122417866",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5041",
//     "stop_code": "5041",
//     "stop_name": "Harvard Square (Northbound)",
//     "stop_desc": "",
//     "stop_lat": "42.372722",
//     "stop_lon": "-71.119965",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "58344",
//     "stop_code": "58344",
//     "stop_name": "Harvard Square (Southbound)",
//     "stop_desc": "",
//     "stop_lat": "42.373378883",
//     "stop_lon": "-71.119734232",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5040",
//     "stop_code": "5040",
//     "stop_name": "Kennedy School (Northbound)",
//     "stop_desc": "",
//     "stop_lat": "42.371524",
//     "stop_lon": "-71.120985",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5054",
//     "stop_code": "5054",
//     "stop_name": "Kennedy School (Southbound)",
//     "stop_desc": "",
//     "stop_lat": "42.371203",
//     "stop_lon": "-71.121339",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5045",
//     "stop_code": "5045",
//     "stop_name": "Lamont Library",
//     "stop_desc": "",
//     "stop_lat": "42.37288",
//     "stop_lon": "-71.115008",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5042",
//     "stop_code": "5042",
//     "stop_name": "Law School (WCC)",
//     "stop_desc": "",
//     "stop_lat": "42.377977084",
//     "stop_lon": "-71.119937392",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "6854",
//     "stop_code": "6854",
//     "stop_name": "Leverett House",
//     "stop_desc": "",
//     "stop_lat": "42.370083645",
//     "stop_lon": "-71.116713434",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5050",
//     "stop_code": "5050",
//     "stop_name": "Mass and Garden",
//     "stop_desc": "",
//     "stop_lat": "42.375187466",
//     "stop_lon": "-71.119467061",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5046",
//     "stop_code": "5046",
//     "stop_name": "Mather House",
//     "stop_desc": "",
//     "stop_lat": "42.368758709",
//     "stop_lon": "-71.115333438",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5043",
//     "stop_code": "5043",
//     "stop_name": "Maxwell Dworkin",
//     "stop_desc": "",
//     "stop_lat": "42.378933",
//     "stop_lon": "-71.11663",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5044",
//     "stop_code": "5044",
//     "stop_name": "Memorial Hall",
//     "stop_desc": "",
//     "stop_lat": "42.37645186",
//     "stop_lon": "-71.114392997",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5049",
//     "stop_code": "5049",
//     "stop_name": "Quad",
//     "stop_desc": "",
//     "stop_lat": "42.381867",
//     "stop_lon": "-71.125325",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "23509",
//     "stop_code": "23509",
//     "stop_name": "Radcliffe Yard",
//     "stop_desc": "",
//     "stop_lat": "42.3765",
//     "stop_lon": "-71.12212",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "6248",
//     "stop_code": "6248",
//     "stop_name": "Science Center",
//     "stop_desc": "",
//     "stop_lat": "42.376901687",
//     "stop_lon": "-71.115974486",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "58343",
//     "stop_code": "58343",
//     "stop_name": "SEC",
//     "stop_desc": "",
//     "stop_lat": "42.363328644",
//     "stop_lon": "-71.125392617",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "154627",
//     "stop_code": "154627",
//     "stop_name": "Sever Gate",
//     "stop_desc": "",
//     "stop_lat": "42.374634042",
//     "stop_lon": "-71.114510008",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5039",
//     "stop_code": "5039",
//     "stop_name": "Stadium (Northbound)",
//     "stop_desc": "",
//     "stop_lat": "42.367121429",
//     "stop_lon": "-71.124887448",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "23930",
//     "stop_code": "23930",
//     "stop_name": "Stadium (Southbound)",
//     "stop_desc": "",
//     "stop_lat": "42.367024629",
//     "stop_lon": "-71.125015193",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5047",
//     "stop_code": "5047",
//     "stop_name": "The Inn",
//     "stop_desc": "",
//     "stop_lat": "42.372127",
//     "stop_lon": "-71.115427",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5048",
//     "stop_code": "5048",
//     "stop_name": "Widener Gate",
//     "stop_desc": "",
//     "stop_lat": "42.372843815",
//     "stop_lon": "-71.116972399",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0,
//     "platform_code": ""
//   },
//   {
//     "stop_id": "5051",
//     "stop_code": "5051",
//     "stop_name": "Winthrop House",
//     "stop_desc": "",
//     "stop_lat": "42.371468397",
//     "stop_lon": "-71.117267311",
//     "stop_url": "",
//     "location_type": 0,
//     "stop_timezone": "",
//     "wheelchair_boarding": 0
//   }
// ]
