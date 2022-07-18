import { Box, Button, Divider, HStack, Text, Tooltip } from '@chakra-ui/react'
import {
  faBolt,
  faBoltSlash,
  faChevronDown,
  faClone,
  faEye,
  faEyeSlash,
} from '@fortawesome/pro-solid-svg-icons'
import { memo } from 'react'
import { pokemonTypeData } from '../../data/pokemon-types'
import {
  PokemonType,
  useSelectedPokemonTypes,
} from '../../hooks/useSelectedPokemonTypes'
import Icon from '../icon'

const PokemonTypeFilter = () => {
  const {
    clearAllSelectedTypes,
    selectedTypes,
    selectAllTypes,
    totalTypes,
    exactFilterEnabled,
    isSelected,
    removeSelectedType,
    setExactFilterEnabled,
    addSelectedType,
    weakFilterEnabled,
    setWeakFilterEnabled,
    isExpanded,
    setIsExpanded,
  } = useSelectedPokemonTypes()

  const handleClick = (type: PokemonType) => {
    isSelected(type) ? removeSelectedType(type) : addSelectedType(type)
  }

  return (
    <Box overflow="hidden">
      <Box
        display="grid"
        gridAutoFlow="column"
        pb={2}
        px={2}
        alignItems="center"
        justifyContent="space-between"
        overflow="hidden"
      >
        <Text
          mr={2}
          fontSize={14}
          color="gray.700"
          fontWeight="700"
          textTransform="uppercase"
        >
          Types
        </Text>
        <HStack shouldWrapChildren>
          <Button
            size="xs"
            isActive={weakFilterEnabled}
            onClick={() => {
              setWeakFilterEnabled(!weakFilterEnabled)
              setExactFilterEnabled(!weakFilterEnabled)
              if (selectedTypes.length === totalTypes && !weakFilterEnabled) {
                const result = confirm(
                  'Going into weak filter mode will clear all currently selected types. Are you sure?',
                )
                result && clearAllSelectedTypes()
              }
            }}
            title="Weak Against"
          >
            <Icon
              w="14px"
              maxH="14px"
              fontSize="14px"
              icon={weakFilterEnabled ? faBolt : faBoltSlash}
            />
            <Box as="span" ml={1} display={['none', 'block']}>
              Weak Against
            </Box>
          </Button>
          <Button
            size="xs"
            isDisabled={weakFilterEnabled}
            isActive={exactFilterEnabled}
            onClick={() => {
              setExactFilterEnabled(!exactFilterEnabled)
              if (selectedTypes.length === totalTypes && !exactFilterEnabled) {
                const result = confirm(
                  'Going into exact match mode will clear all currently selected types. Are you sure?',
                )
                result && clearAllSelectedTypes()
              }
            }}
            title="Exact Match"
          >
            <Icon fixedWidth w="14px" icon={faClone} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Exact Match
            </Box>
          </Button>
          <Button
            size="xs"
            onClick={clearAllSelectedTypes}
            isActive={selectedTypes.length > 0}
            isDisabled={selectedTypes.length === 0}
            title="Clear All"
          >
            <Icon fixedWidth w="14px" icon={faEyeSlash} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Clear All
            </Box>
          </Button>
          <Button
            size="xs"
            onClick={() => {
              selectAllTypes()
            }}
            isActive={selectedTypes.length < totalTypes}
            isDisabled={selectedTypes.length === totalTypes}
            title="Select All"
          >
            <Icon fixedWidth w="14px" icon={faEye} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Select All
            </Box>
          </Button>
          <Tooltip
            label={isExpanded ? 'Collapse' : 'Expand'}
            aria-label="Expand tooltip"
          >
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              size="xs"
              transform={isExpanded ? 'rotate(180deg)' : undefined}
              variant="ghost"
            >
              <Icon fixedWidth w="12px" icon={faChevronDown} />
            </Button>
          </Tooltip>
        </HStack>
      </Box>
      <Divider borderColor="gray.400" mb={3} />
      <Box
        display="grid"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        gridGap={[2, 4]}
        gridAutoFlow={isExpanded ? 'row' : 'column'}
        gridTemplateColumns={
          isExpanded
            ? [
                'repeat(auto-fill, minmax(100px, auto))',
                'repeat(auto-fill, minmax(120px, auto))',
                null,
                'repeat(9, auto)',
              ]
            : 'unset'
        }
        overflowX="scroll"
      >
        {(Object.keys(pokemonTypeData) as PokemonType[]).map(type => (
          <TypeBadge key={type} type={type} handleClick={handleClick} />
        ))}
      </Box>
    </Box>
  )
}

export default PokemonTypeFilter

const TypeBadge = memo(
  ({ type, handleClick }: { type: PokemonType; handleClick: any }) => {
    const { icon, primary, color } = pokemonTypeData[type]
    const { isSelected, exactFilterEnabled, selectedTypes, isExpanded } =
      useSelectedPokemonTypes()
    const maxSelected = exactFilterEnabled && selectedTypes.length === 2
    const isDisabled = maxSelected && !isSelected(type)
    return (
      <Button
        minW="auto"
        size="xs"
        w={!isExpanded ? [8, 'auto'] : 'auto'}
        h={!isExpanded ? [8, 'auto'] : 'auto'}
        // variant="unstyled"
        // minW="90px"
        onClick={() => handleClick(type)}
        fontSize="xs"
        display="flex"
        fontWeight={700}
        borderRadius={['100%', 20]}
        alignItems="center"
        justifyContent="center"
        textTransform="uppercase"
        borderWidth={2}
        borderColor="transparent"
        transition="all 0.2s ease"
        isDisabled={isDisabled}
        _hover={{
          borderColor: primary,
          color: isSelected(type) ? color : primary,
        }}
        bgColor={isSelected(type) ? primary : 'gray.200'}
        color={isSelected(type) ? color : 'gray.600'}
      >
        {/* Supports for react-icons */}
        {typeof icon === 'function' && (
          <Box mr={1} minW="14px" maxH="14px" fontSize="14px">
            {(icon as any)()}
          </Box>
        )}
        {typeof icon === 'object' && (
          <Icon mr={[1, 0]} w="16px" maxH="10px" icon={icon} />
        )}
        <Box w="100%" display={!isExpanded ? ['none', null, 'block'] : 'unset'}>
          {type}
        </Box>
      </Button>
    )
  },
)

TypeBadge.displayName = 'TypeBadge'
