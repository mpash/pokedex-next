import { Box, Button, Divider, HStack, Text, Tooltip } from '@chakra-ui/react'
import {
  faBolt,
  faBoltSlash,
  faCalculator,
  faCheckCircle,
  faChevronDown,
  faCircleBolt,
  faCircleExclamationCheck,
  faClone,
  faEquals,
  faEye,
  faEyeSlash,
  faLambda,
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
    if (selectedTypes.length === 2) {
      console.log('hit')
      clearAllSelectedTypes()
    }

    if (isSelected(type)) {
      removeSelectedType(type)
    } else {
      addSelectedType(type)
    }
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
        <HStack shouldWrapChildren overflowX="scroll">
          <Button
            size="xs"
            variant="outline"
            isActive={weakFilterEnabled}
            onClick={() => {
              setWeakFilterEnabled(!weakFilterEnabled)
            }}
            // isDisabled={exactFilterEnabled}
            title="Weak Against"
          >
            <Icon
              w="14px"
              maxH={weakFilterEnabled ? '12px' : '14px'}
              icon={weakFilterEnabled ? faBolt : faBoltSlash}
            />
            <Box as="span" ml={1} display={['none', 'block']}>
              Weak Against
            </Box>
          </Button>
          <Button
            size="xs"
            variant="outline"
            // isDisabled={weakFilterEnabled}
            isActive={exactFilterEnabled}
            onClick={() => {
              setExactFilterEnabled(!exactFilterEnabled)
            }}
            title="Exact Match"
          >
            <Icon w="14px" maxH="14px" icon={faLambda} />
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
            <Icon w="14px" maxH="14px" icon={faEyeSlash} />
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
            isDisabled={
              selectedTypes.length === totalTypes ||
              exactFilterEnabled ||
              weakFilterEnabled
            }
            title="Select All"
          >
            <Icon w="14px" maxH="14px" icon={faEye} />
            <Box as="span" ml={1} display={['none', 'block']}>
              Select All
            </Box>
          </Button>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            size="xs"
            transform={isExpanded ? 'rotate(180deg)' : undefined}
            variant="ghost"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Icon fixedWidth w="12px" icon={faChevronDown} />
          </Button>
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
        gridGap={[2, null, 4]}
        gridAutoFlow={isExpanded ? 'row' : 'column'}
        gridTemplateColumns={
          isExpanded
            ? [
                'repeat(auto-fill, minmax(90px, auto))',
                null,
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
    const {
      isSelected,
      exactFilterEnabled,
      selectedTypes,
      isExpanded,
      weakFilterEnabled,
    } = useSelectedPokemonTypes()
    // const maxSelected = exactFilterEnabled && selectedTypes.length === 2
    // const isDisabled = maxSelected && !isSelected(type)
    return (
      <Button
        minW="auto"
        size="xs"
        py={0.5}
        // p={[1, null, 0]}
        // w={!isExpanded ? [8, 'auto'] : 'unset'}
        // h={!isExpanded ? [8, 'auto'] : 'unset'}
        // variant="unstyled"
        // minW="auto"
        onClick={() => handleClick(type)}
        fontSize="xs"
        fontWeight={700}
        borderRadius={25}
        // borderRadius={isExpanded ? 10 : ['100%', 20]}
        // display="flex"
        // alignItems="center"
        // justifyContent="center"
        textTransform="uppercase"
        borderWidth={2}
        borderColor="transparent"
        transition="all 0.2s ease"
        // isDisabled={isDisabled}
        _hover={{
          borderColor: primary,
          color: isSelected(type) ? color : primary,
        }}
        bgColor={isSelected(type) ? primary : 'gray.200'}
        color={isSelected(type) ? color : 'gray.600'}
        textShadow="1px 1px 0px rgba(0, 0, 0, 0.1)"
      >
        {/* Supports for react-icons */}
        {typeof icon === 'function' && (
          <Box mr={1} minW="14px" maxH="14px" fontSize="14px">
            {(icon as any)()}
          </Box>
        )}
        {typeof icon === 'object' && (
          <Icon
            minW="14px"
            h="14px"
            fixedWidth
            icon={icon}
            fontSize="14px"
            mr={isExpanded ? 1 : [0, null, 1]}
            filter="drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.1))"
          />
        )}
        <Box display={!isExpanded ? ['none', null, 'block'] : 'unset'}>
          {type}
        </Box>
      </Button>
    )
  },
)

TypeBadge.displayName = 'TypeBadge'
