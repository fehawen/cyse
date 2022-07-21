import { AlertCircle, Circle, CircleCheck } from 'tabler-icons-react'
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core'

export default function NavbarItem({ site, active, error, onClick }) {
    const iconProps = { size: 24 }

    return (
        <UnstyledButton
            py="xs"
            onClick={() => (error || active) ? {} : onClick(site)}
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                borderTopRightRadius: theme.radius.md,
                borderBottomRightRadius: theme.radius.md,
                color: error ? theme.colors.red[6] : theme.colors.gray[active ? 9 : 6],
                cursor: (error || active) ? 'default' : 'pointer',
                transition: 'all 0.15s ease-in-out 0s',

                '&:hover': (error || active) ? {} : {
                    color: theme.colors.gray[7],
                },
            })}
        >
            <Group align="center" spacing="xs">
                <Text
                    inline
                    sx={(theme) => ({
                        color: error
                            ? theme.colors.red[6]
                            : active
                                ? theme.colors.grape[6]
                                : theme.colors.gray[5],
                    })}
                >
                    {
                        error
                            ? <AlertCircle {...iconProps} />
                            : active
                                ? <CircleCheck {...iconProps} />
                                : <Circle {...iconProps} />
                    }
                </Text>
                <Text inline size="sm" weight="bold">
                    {site.name}
                </Text>
            </Group>
        </UnstyledButton>
    )
}
