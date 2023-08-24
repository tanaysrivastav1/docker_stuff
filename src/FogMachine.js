import Particles from "react-particles";
import { useCallback } from "react";

const FogMachine = () => {

    const particlesLoaded = useCallback(container => {
        console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    zIndex: 1
                },
                particles: {
                    color: {
                        value: ["#aaa", "#ddd"]
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        outMode: "out",
                        attract: {
                            enable: false
                        }
                    },
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 1000
                        }
                    },
                    opacity: {
                        value: 0.5,
                        anim: {
                            enable: true,
                            speed: 0.5,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 50,
                        random: true
                    }
                }
            }}
        />
    );
}

export default FogMachine;