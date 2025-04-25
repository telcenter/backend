export function envKeyIsInvalidOrMissing(keyName: string): never {
    throw new Error(`Environment variable ${keyName} is invalid or missing.`);
}

export enum NumberEnvRequirement {
    NONE,
    MUST_BE_POSITIVE,
    MUST_BE_POSITIVE_OR_ZERO,
};

export function readNumberEnv(keyName: string, requirement: NumberEnvRequirement): number {
    const validate = (): number|null => {
        const N = +(process.env[keyName] || NaN);

        if (isNaN(N)) return null;
        if (!isFinite(N)) return null;
    
        switch (requirement) {
            case NumberEnvRequirement.MUST_BE_POSITIVE:
                if (N <= 0) return null;
            
            case NumberEnvRequirement.MUST_BE_POSITIVE_OR_ZERO:
                if (N < 0) return null;
        }

        return N;
    };

    const N = validate();
    if (N === null) envKeyIsInvalidOrMissing(keyName);
    return N;
}

export function readBooleanEnv(keyName: string): boolean {
    const valueAsString = process.env[keyName];

    if (undefined === valueAsString) envKeyIsInvalidOrMissing(keyName);

    switch (valueAsString) {
        case 'true':
            return true;
        
        case 'false':
            return false;
        
        default:
            envKeyIsInvalidOrMissing(keyName);
    }
}

export function readNonEmptyStringEnv(keyName: string): string {
    return process.env[keyName] || envKeyIsInvalidOrMissing(keyName);
}

export function readOptionalStringEnv(keyName: string): string|null {
    return process.env[keyName] || null;
}

export function readStringListEnv(keyName: string, { ignoreEmptySegments } : {
    ignoreEmptySegments: boolean,
}): string[] {
    const rawString = readNonEmptyStringEnv(keyName);

    let stringList = rawString.split(',');

    if (ignoreEmptySegments) {
        stringList = stringList.filter(s => s.length > 0);
    }

    return stringList;
}
