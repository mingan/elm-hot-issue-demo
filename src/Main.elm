module Main exposing (main)

import Time



-- ---------------------------
-- MODEL
-- ---------------------------


type alias Model =
    ()


init : () -> ( Model, Cmd Msg )
init _ =
    ( (), Cmd.none )



-- ---------------------------
-- UPDATE
-- ---------------------------


type Msg
    = Tick Time.Posix


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        Tick t ->
            let
                _ =
                    Debug.log "time" t
            in
            ( model, Cmd.none )



-- ---------------------------
-- MAIN
-- ---------------------------


main : Program () Model Msg
main =
    Platform.worker
        { init = init
        , update = update
        , subscriptions = \_ -> Time.every (3 * 1000) Tick
        }
