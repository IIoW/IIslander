import Enmap from 'enmap';
import FactionDto from './dto/FactionDto';
import ResponseDto from './dto/ResponseDto';
import UserDto from './dto/UserDto';
import KeyDto from './dto/KeyDto';

/**
 * Serialize database objects.
 */
function serializer(object) {
    return object.toJSON();
}

/**
 * Deserialize user database objects.
 */
function deserializerUserDto(object) {
    return UserDto.fromJSON(object);
}

/**
 * Deserialize auto response database objects.
 */
function deserializerResponseDto(object) {
    return ResponseDto.fromJSON(object);
}

/**
 * Deserialize key database objects.
 */
function deserializerKeyDto(object) {
    return KeyDto.fromJSON(object);
}

/**
 * Deserialize faction database objects.
 */
function deserializerFactionDto(object) {
    return FactionDto.fromJSON(object);
}

/**
 * Database to store user data in it.
 * @type {Enmap<string, UserDto>}
 * @see {@link UserDto}
 */
const userDb = new Enmap({
    name: 'users',
    serializer,
    deserializer: deserializerUserDto,
    autoEnsure: new UserDto(),
});
/**
 * Database to store auto response data in it.
 * @type {Enmap<string, ResponseDto>}
 * @see {@link ResponseDto}
 */
const responseDb = new Enmap({
    name: 'autoresponses',
    serializer,
    deserializer: deserializerResponseDto,
    autoEnsure: new ResponseDto(),
});
/**
 * Database to store auto response data in it.
 * @type {Enmap<string, KeyDto>}
 * @see {@link KeyDto}
 */
const keyDb = new Enmap({
    name: 'keys',
    serializer,
    deserializer: deserializerKeyDto,
});
/**
 * Database to store faction data in it.
 * @type {Enmap<string, FactionDto>}
 * @see {@link KeyDto}
 */
const factionDb = new Enmap({
    name: 'factions',
    serializer,
    deserializer: deserializerFactionDto,
    autoEnsure: new FactionDto(),
});

export { factionDb, keyDb, responseDb, userDb };
