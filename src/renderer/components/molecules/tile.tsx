import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'

import { logos } from '../../../config/logos'
import { useSelector } from '../../store'
import {
  changedHotkey,
  clickedEyeButton,
  clickedFavButton,
  clickedTile,
} from '../../store/actions'
import { ExtendedApp } from '../../store/selector-hooks'
import Kbd from '../atoms/kbd'

interface Props {
  app: ExtendedApp
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const theme = useSelector((state) => state.theme)
  const editMode = useSelector((state) => state.ui.editMode)

  return (
    <div className={clsx('relative', 'w-28', className)}>
      <button
        key={app.id}
        aria-label={`${app.name} Tile`}
        className={clsx(
          'w-28 p-8',
          'flex flex-col items-center justify-center max-h-full',
          'focus:outline-none',
          !editMode && 'hover:bg-black hover:bg-opacity-10',
        )}
        data-for={app.id}
        data-tip
        disabled={editMode}
        onClick={(event) =>
          !editMode &&
          dispatch(
            clickedTile({
              url,
              appId: app.id,
              isAlt: event.altKey,
              isShift: event.shiftKey,
            }),
          )
        }
        title={app.name}
        type="button"
      >
        <img
          alt={app.name}
          className={clsx(
            'w-full object-contain',
            !app.isVisible && 'opacity-25',
            editMode && 'animate-wiggle',
          )}
          src={logos[app.id]}
        />

        {editMode ? (
          <div
            className={clsx(
              'flex-shrink-0 flex justify-center items-center mt-2 space-x-1',
            )}
          >
            <FontAwesomeIcon
              className="opacity-50"
              fixedWidth
              icon={faKeyboard}
              size="xs"
            />
            <input
              aria-label={`${app.name} hotkey`}
              className={clsx(
                'text-xs text-white bg-black uppercase focus:outline-none min-w-0 w-full text-center rounded',
              )}
              data-app-id={app.id}
              maxLength={1}
              minLength={0}
              onChange={(event) => {
                dispatch(
                  changedHotkey({
                    appId: app.id,
                    value: event.currentTarget.value,
                  }),
                )
              }}
              onFocus={(event) => {
                event.target.select()
              }}
              type="text"
              value={app.hotkey || ''}
            />
          </div>
        ) : (
          <Kbd className="flex-shrink-0 flex justify-center items-center mt-2">
            {isFav && (
              <FontAwesomeIcon
                aria-label="Favourite"
                className={css({ color: theme.accent })}
                icon={faStar}
                role="img"
              />
            )}
            {app.hotkey ? (
              <span className="ml-2">{app.hotkey}</span>
            ) : (
              // Prevents box collapse when hotkey not set
              <span className="opacity-0 w-0">.</span>
            )}
          </Kbd>
        )}
      </button>

      {editMode && (
        <button
          className="absolute top-5 left-5 focus:outline-none shadow bg-black flex justify-center items-center rounded-full h-6 w-6"
          onClick={() => dispatch(clickedFavButton(app.id))}
          type="button"
        >
          <FontAwesomeIcon
            className={clsx(!app.isFav && 'opacity-25')}
            fixedWidth
            icon={faStar}
            size="xs"
            style={{ color: app.isFav ? theme.accent : 'white' }}
          />
        </button>
      )}

      {editMode && (
        <button
          className="absolute top-5 right-5 focus:outline-none shadow bg-black flex justify-center items-center rounded-full h-6 w-6"
          onClick={() => dispatch(clickedEyeButton(app.id))}
          type="button"
        >
          <FontAwesomeIcon
            className={clsx(!app.isVisible && 'opacity-25', 'text-white')}
            fixedWidth
            icon={app.isVisible ? faEye : faEyeSlash}
            size="xs"
          />
        </button>
      )}
    </div>
  )
}

export default Tile
