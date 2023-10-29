import React from 'react'

const Card = (props) => {
  return (
    <section className="timeline__item">
        <i className={props.icon}></i>
        <span className="timeline__date">{props.year}</span>
        <h3 className="timeline__title">{props.title}</h3>
        <p className="timeline__description">{props.desc}</p>
    </section>
  )
}

export default Card