import React, { useEffect, useState } from 'react'
import { FloatingLabel, Form, Row, Col, Button, ButtonGroup, ProgressBar, } from 'react-bootstrap'


export const LevelBar = (props) => {

    const [state, setState] = useState({
        xp: 0.00,
        level: 0,
        levelXP: 0.00,
        xpPercent: 0,
        firstLoad: true,
    })

    const { 
        xp,
        level,
        levelXP,
        xpPercent,
        firstLoad,
    } = state

    useEffect(() => {
        if (firstLoad) {
            setState({
                xp: props.xp,
                level: props.level,
                levelXP: props.levelXP,
                xpPercent: props.xp * 100,
                firstLoad: false,
            })
        }
    }, [state, props, firstLoad])

    return (<>
        <ProgressBar variant='info' now={xp} min={0} max={levelXP}/>
    </>);
}

export default LevelBar;