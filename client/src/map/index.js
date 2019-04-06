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
import Slider from "react-input-slider"
import { Motion, spring } from "react-motion"

const wrapperStyles = {
    width: "100%",
    maxWitdth: 1080,
    margin: "0 auto",
};

const countryScale = scaleLinear()
    .domain([0, 90.0])
    .range([2,250]);

class BasicMap extends Component {
    constructor() {
        super();
        this.state = {
            energy: [],
            coords: [],
            center: [0,20],
            year: 1980,
            zoom: 1.5,
            activeCountry: -1
        };
        this.fetchEnergy = this.fetchEnergy.bind(this);
        this.fetchCoords = this.fetchCoords.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this)
        this.handleZoomOut = this.handleZoomOut.bind(this)
        this.handleReset = this.handleReset.bind(this)
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
        // console.log("Marker data: ", marker);
        // this.setState({
        //     activeCountry: marker.Country
        // });
        //
        // console.log("Active country code: ", this.state.activeCountry)
    }
    handleZoomIn() {
        this.setState({
            zoom: this.state.zoom * 2,
        })
    }
    handleZoomOut() {
        this.setState({
            zoom: this.state.zoom / 2,
        })
    }
    handleReset() {
        this.setState({
            center: [0,20],
            zoom: 1.5,
        })
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
                    <div class={"buttons"}>
                        <button onClick={this.handleZoomIn}>
                            { "Zoom in" }
                        </button>
                        <button onClick={this.handleZoomOut}>
                            { "Zoom out" }
                        </button>
                        <button onClick={this.handleReset}>
                            { "Reset" }
                        </button>
                    </div>
                    <Motion
                        defaultStyle={{
                            zoom: 1,
                            x: 0,
                            y: 20,
                        }}
                        style={{
                            zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
                            x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
                            y: spring(this.state.center[1], {stiffness: 210, damping: 20}),
                        }}
                    >
                        {({zoom,x,y}) => (
                    <ComposableMap
                        projectionConfig={{
                            scale: 205,
                            rotation: [-11,0,0],
                        }}
                        width={1980}
                        height={800}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    >
                        <ZoomableGroup center={[x,y]} zoom={zoom}>
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
                                                fill="rgba(255,251,0,0.4)"
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
                        )}
                    </Motion>
                    <div>
                        <Slider
                            styles={{
                                active: {
                                    backgroundColor: "#3E8745"
                                }
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