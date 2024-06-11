import React, { useImperativeHandle } from 'react'
import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Stack } from 'react-bootstrap'

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false)

  const hideWhenVisiable = { display: visible ? 'none' : 'block' }
  const showWhenVisiable = { display: visible ? 'block' : 'none' }
  const toggleVsible = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVsible,
    }
  })

  return (
    <Stack style={{paddingTop: "8px", paddingBottom: "8px"}}>
      <div style={hideWhenVisiable}>
        <Button onClick={toggleVsible}>{props.label}</Button>
      </div>
      <div style={showWhenVisiable}>
        {props.children}
        <button onClick={toggleVsible}>cancel</button>
      </div>
    </Stack>
  )
})

Toggleable.displayName = 'Toggleable'
Toggleable.propTypes = {
  label: PropTypes.string.isRequired,
}

export default Toggleable
