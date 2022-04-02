import { AlertCircle, Circle, CircleCheck } from 'tabler-icons-react'
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core'

export default function NavbarItem({ site, active, error, onClick }) {
    const iconProps = { size: 20 }

    return (
        <UnstyledButton
            my="xs"
            onClick={() => (error || active) ? {} : onClick(site)}
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderTopRightRadius: theme.radius.lg,
                borderBottomRightRadius: theme.radius.lg,
                backgroundColor: active ? theme.colors.dark[5] : 'transparent',
                color: error ? theme.colors.red[5] : theme.colors.dark[active ? 0 : 1],
                cursor: (error || active) ? 'default' : 'pointer',
                transition: 'all 0.15s ease-in-out 0s',

                '&:hover': (error || active) ? {} : {
                    color: theme.colors.dark[0],
                    backgroundColor: theme.colors.dark[4],
                },
            })}
        >
            <Group align="center">
                <Text
                    inline
                    pl={2}
                    sx={(theme) => ({
                        color: error
                            ? theme.colors.red[5]
                            : active
                                ? theme.colors.green[5]
                                : theme.colors.dark[2],
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
