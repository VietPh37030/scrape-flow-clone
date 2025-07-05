"use client";
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup';
export default function ReactCountUpWrapper({value}:{value:number}) {
    const [mouted, setMouted] = useState(false);
    useEffect(()=>{
       setMouted(true); 
    },[!mouted]);
    if(!mouted){
        return "-";
    }
  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />
}
