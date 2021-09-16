import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined'
import TextField from '@material-ui/core/TextField'
import {
  MOBILE_VIEW_HEADER_HEIGHT,
  DESKTOP_VIEW_HEADER_HEIGHT,
  DEFAULT_FONT_SIZE,
} from '../../utils/utils'
import { useGlobalContext } from '../../../context'

const MobileViewSearchDrawer = () => {
  const { isSearchDrawerOpen, setIsSearchDrawerOpen } = useGlobalContext()
  return (
    <Drawer
      anchor="top"
      open={isSearchDrawerOpen}
      onClose={() => setIsSearchDrawerOpen(false)}
      transitionDuration={0} // disable the transition animation
    >
      <MobileToolbar disableGutters>
        <MobileBackIcon onClick={() => setIsSearchDrawerOpen(false)} />
        <MobileSearchField placeholder="Search YouTube" />
        <MobileSearchIcon onClick={() => setIsSearchDrawerOpen(false)} />
      </MobileToolbar>
    </Drawer>
  )
}

export default MobileViewSearchDrawer

const MobileToolbar = styled(Toolbar)`
  && {
    @media screen and (max-width) {
      min-height: ${MOBILE_VIEW_HEADER_HEIGHT}px;
    }
    min-height: ${DESKTOP_VIEW_HEADER_HEIGHT}px;
  }
`

const MobileBackIcon = styled(ArrowBackOutlinedIcon)`
  color: #606060;
  margin: 12px;
`

const MobileSearchField = styled(TextField)`
  flex-grow: 1;

  .MuiInputBase-input {
    font-size: ${DEFAULT_FONT_SIZE}px;
  }
`

const MobileSearchIcon = styled(SearchOutlinedIcon)`
  color: #606060;
  margin: 8px;
`