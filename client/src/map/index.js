import React, { Component } from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import request from "axios"

const wrapperStyles = {
    width: "100%",
    maxWitdth: 980,
    margin: "0 auto",
};

const countryScale = scaleLinear()
    .domain([0, 37843000])
    .range([1,25]);

class BasicMap extends Component {
    constructor() {
        super();
        this.state = {
            energy: [],
            coords: [],
        };
        this.fetchEnergy = this.fetchEnergy.bind(this);
        this.fetchCoords = this.fetchCoords.bind(this);
    }
    componentDidMount() {
        this.fetchEnergy();
        this.fetchCoords();
    }
    fetchEnergy() {
        request
            .get("./countries.json")
            .then(res => {
                this.setState({
                    energy:res.data,
                })
            })
    }
    fetchCoords() {
        request
            .get("./coords.json")
            .then(res => {
                this.setState({
                    coords:res.data,
                })
            })
    }

    render() {
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
                                            fill: "#ECEFF1",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#FF5722",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))}
                        </Geographies>
                        <Markers>
                            {
                                this.state.energy.map((country, i) => (
                                    <Marker key={i} marker={country}>
                                        <circle
                                            cx={0}
                                            cy={0}
                                            r={countryScale(country.a2008)}
                                            fill="rgba(255,87,34,0.8)"
                                            stroke="#607D8B"
                                            strokeWidth="2"
                                        />
                                    </Marker>
                                ))
                            }
                        </Markers>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        )
    }
}

export default BasicMap