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
        console.log("Marker data: ", marker);
        // this.setState({
        //     activeCountry: marker.Country
        // });
        //
        // console.log("Active country code: ", this.state.activeCountry)
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
                        <div class="year_text">
                        Current year: {this.state.year}
                        </div>
                    </div>
                </div>

            )
        }

        return <div>Loading...</div>

    }
}

export default BasicMap