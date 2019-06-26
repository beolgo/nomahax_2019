import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
    Annotations,
    Annotation,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import request from "axios"
import Slider from "react-input-slider";
import SideBarInfo from "./SideBarInfo.js"

const wrapperStyles = {
    width: "100%",
    maxWitdth: 980,
    margin: "0 auto",
};

const countryScale = scaleLinear()
    .domain([0, 90.0])
    .range([4,100]);

class BasicMap extends Component {
    constructor() {
        super();
        this.state = {
            energy: [],
            coords: [],
            year: 1980,
            activeCountry: -1
        };
        this.fetchEnergy = this.fetchEnergy.bind(this);
        this.fetchCoords = this.fetchCoords.bind(this);
        this.handleHover = this.handleHover.bind(this);
    }
    componentDidMount() {
        this.fetchEnergy();
        this.fetchCoords();
        this.handleHover();
    }
    convertToString(string) {
        //converts to a string we like
        let arr = string.replace(/[,\/#!$%\^&\*;:{}=\-_`~()""]/g, ' ');
        let arr2 = arr.replace("Country", "").replace("coordinates", "").replace("value", "");
        //let finalarr = arr2.split();
        return arr2;
    }
    fetchEnergy() {
        request
            .get("https://raw.githubusercontent.com/beolgo/nomahax_2019/warreng/client/src/map/countries.json")
            .then(res => {
                this.setState({
                    energy: res.data
                })
            })
    }
    fetchCoords() {
        request
            .get("https://raw.githubusercontent.com/beolgo/nomahax_2019/warreng/client/src/map/coords.json")
            .then((res) => {
                this.setState({
                    coords:res.data,
                })
            })
    }
    handleHover(marker, event){
        let pop_up = document.getElementById("CountryInfo");
        if (marker) {
            //pop_up.innerHTML = this.convertToString(JSON.stringify(marker));
            var arr = this.convertToString(JSON.stringify(marker));
            let send_arr = arr.split(" ");
            let cur_name = " ";
            let cur_coords = " ";
            let cur_val = 0;

            //console.log(send_arr);
            var info = "";
            var info_arr = "";
            for (var i = 0; i < send_arr.length; i++) 
            {
                
                if (send_arr[i] !== "")
                {
                    info+=send_arr[i] + " ";
                }
            }
            info_arr = info.replace("[", "").replace("]", "");
            let info_arr2 = info_arr.split(" ");
            //console.log(info.split(" "));
            //console.log(info_arr2);
            //console.log(info_arr2.length);
            let got_cords = false;

            
            for (var j = 0; j < info_arr2.length; j++)
            {
                //console.log(info_arr[j]);
                if (typeof info_arr2[j] === "string" && isNaN(info_arr2[j]))
                {
                    cur_name += info_arr2[j] + " ";
                }
            }
            cur_val = info_arr2[info_arr2.length-2];
            for (var k = 0; k < info_arr2.length-2; k++)
            {
                if (!isNaN(info_arr2[k]))
                {
                    cur_coords += info_arr2[k] + " ";
                }
            }
            
            
            //pop_up.innerHTML = arr;
            
            var popUpBox = React.createElement(
                'SideBarInfo',
                {
                    name: cur_name,
                    coords: cur_coords,
                    val: cur_val
                },
                this.props.children
            );

            //console.log(popUpBox);
            pop_up.innerHTML = popUpBox.props.name + "<br>" + popUpBox.props.coords + "<br>" + popUpBox.props.val;
            //pop_up.innerHTML = <SideBarInfo name={cur_name} coords={cur_coords} val={cur_val}/>
                    
        }
        //document.body.appendChild(popUpBox);
    }

    render() {

        if(this.state.coords.length && this.state.energy.length){

            const coords = this.state.coords;
            this.state.energy.forEach((value, index) => {
                coords[index].value = value["a" + this.state.year];
            });
            // console.log(coords);

            return (
                <div style={wrapperStyles}>
                    <ComposableMap
                        projectionConfig={{
                            scale: 205,
                            rotation: [-11,0,0],
                        }}
                        width={980}
                        height={551}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <ZoomableGroup center={[0,20]} disablePanning>
                            <Geographies geography="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m.json">
                                {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                                    <Geography
                                        key={i}
                                        geography={geography}
                                        projection={projection}
                                        style={{
                                            default: {
                                                fill: "#3E8745",
                                                stroke: "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: "#85c87c",
                                                stroke: "#607D8B",
                                                strokeWidth: 0.75,
                                                outline: "none",
                                            },
                                            // pressed: {
                                            //     fill: "#FF5722",
                                            //     stroke: "#607D8B",
                                            //     strokeWidth: 0.75,
                                            //     outline: "none",
                                            // },
                                        }}
                                    />
                                ))}
                            </Geographies>
                            <Markers>
                                {
                                    coords.map((country, i) => (
                                        <Marker key={i}
                                                marker={country}
                                                onMouseEnter={ this.handleHover }
                                        >
                                            <circle
                                                cx={0}
                                                cy={0}
                                                r={countryScale(country.value)}
                                                fill="rgba(255,251,0,0.5)"
                                                stroke="#607D8B"
                                                strokeWidth="2"
                                            />
                                        </Marker>
                                    ))
                                }
                            </Markers>
                            <Annotations>
                                {

                                    this.state.coords.map((country, i) => (

                                        <Annotation
                                            key={i}
                                            dx={ 0 }
                                            dy={ 0 }
                                            subject={ country.coordinates }
                                            strokeWidth={ 1 }
                                        >

                                            <text>
                                                {/*{coords[this.state.activeCountry].value}*/}
                                            </text>

                                        </Annotation>

                                    ))
                                }
                            </Annotations>
                        </ZoomableGroup>
                    </ComposableMap>
                    <div>
                        <Slider
                            styles={{

                            }}
                            axis="x"
                            xmin={1980}
                            xmax={2008}
                            x={this.state.year}
                            onChange={({ x }) => this.setState({year: x})}
                        />
                        <br/>
                        <div className="year_text">
                            Current year: {this.state.year}
                        </div>
                    </div>
                    <div id="CountryInfo">

                    </div>
                        
                </div>

            )
        }// if closing

        return <div>Loading...</div> // this is to return a loading screen before the actual component loads

    }// render closing
}

export default BasicMap;

