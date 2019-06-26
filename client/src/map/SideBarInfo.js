import React, {Component} from "react";



class SideBarInfo extends Component
{
	constructor(name, coords, value)
	{
		super();
		this.state = {
			name: name,
			coords: coords,
			val: value
		};

	}
	render()
	{
		return (
			<table id="SideBar">
				<tbody>
					<tr> 
						<th>Name</th>
						<th>Coordinates</th>
						<th>Value</th>
					</tr>
					<tr>
						<td>{this.state.name}</td>
						<td>{this.state.coords}</td>
						<td>{this.state.value}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default SideBarInfo;