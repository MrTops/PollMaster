/*
*   Generates a random color when I tell it too :3
*/

exports.randHexColor = () => {return "#"+((1<<24)*Math.random()|0).toString(16)};