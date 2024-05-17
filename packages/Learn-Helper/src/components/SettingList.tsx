import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'

import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'

import { SETTINGS_FUNC_LIST } from '../ui'
import { useAppDispatch } from '../redux/hooks'

import styles from '../css/list.module.css'
import IconWrench from '~icons/fa6-solid/wrench'

function SettingList() {
  const { _ } = useLingui()
  const dispatch = useAppDispatch()

  return (
    <List
      className={styles.numbered_list}
      component="nav"
      subheader={(
        <ListSubheader component="div" disableSticky className={styles.list_title_header}>
          <IconWrench />
          <span className={styles.list_title}>
            <Trans>设置</Trans>
          </span>
        </ListSubheader>
      )}
    >
      {SETTINGS_FUNC_LIST.map(i => (
        <ListItemButton
          className={styles.sidebar_list_item}
          key={i.name.id}
          onClick={() => {
            i.handler?.(dispatch)
          }}
        >
          <ListItemIcon className={styles.list_item_icon}>{i.icon}</ListItemIcon>
          <ListItemText primary={_(i.name)} className={styles.settings_list_item_text} />
        </ListItemButton>
      ))}
    </List>
  )
}

export default SettingList
