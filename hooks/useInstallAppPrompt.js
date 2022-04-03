import { useEffect, useState } from 'react'

export default function useInstallAppPrompt() {
    const [promptEvent, setPromptEvent] = useState(null)

    function promptInstall() {
        if (promptEvent) return promptEvent.prompt()
    }

    useEffect(() => {
        function ready(event) {
            event.preventDefault()
            setPromptEvent(event)
        }

        window.addEventListener('beforeinstallprompt', ready)

        return () => {
            window.removeEventListener('beforeinstallprompt', ready)
        }
    }, [])

    return [promptEvent, promptInstall]
}
