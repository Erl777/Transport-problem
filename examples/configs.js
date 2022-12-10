// без ограничений по времении
const conf = {
    name: 'LP',
    objective: {
        direction: glpk.GLP_MIN,
        name: 'obj',
        vars: [
            { name: 'x1', coef: 4 },
            { name: 'x2', coef: 5 },
            { name: 'x3', coef: 6 },
            { name: 'x4', coef: 3 },
            { name: 'x5', coef: 2 },
            { name: 'x6', coef: 5 },
            { name: 'x7', coef: 4 },
            { name: 'x8', coef: 6 },
            { name: 'x9', coef: 3 },
            { name: 'x10', coef: 4 },
            { name: 'x11', coef: 7 },
            { name: 'x12', coef: 1 },
        ]
    },
    subjectTo: [
        {
            name: 'cons1',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x2', coef: 1 },
                { name: 'x3', coef: 1 },
                { name: 'x4', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 110, lb: 110 }
        },
        {
            name: 'cons2',
            vars: [
                { name: 'x5', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x8', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 190, lb: 190 }
        },
        {
            name: 'cons3',
            vars: [
                { name: 'x9', coef: 1 },
                { name: 'x10', coef: 1 },
                { name: 'x11', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 90, lb: 90 }
        },
        {
            name: 'cons4',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x5', coef: 1 },
                { name: 'x9', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 80, lb: 80 }
        },
        {
            name: 'cons5',
            vars: [
                { name: 'x2', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x10', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 60, lb: 60 }
        },
        {
            name: 'cons6',
            vars: [
                { name: 'x3', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x11', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 170, lb: 170 }
        },
        {
            name: 'cons7',
            vars: [
                { name: 'x4', coef: 1 },
                { name: 'x8', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 80, lb: 80 }
        }
    ]
};

// не закрытая
const res2 = {
    name: 'LP2',
    objective: {
        direction: glpk.GLP_MIN,
        name: 'obj',
        vars: [
            { name: 'x1', coef: 4 },
            { name: 'x2', coef: 5 },
            { name: 'x3', coef: 3 },
            { name: 'x4', coef: 6 },
            { name: 'x5', coef: 7 },
            { name: 'x6', coef: 2 },
            { name: 'x7', coef: 1 },
            { name: 'x8', coef: 5 },
            { name: 'x9', coef: 6 },
            { name: 'x10', coef: 1 },
            { name: 'x11', coef: 4 },
            { name: 'x12', coef: 2 },
        ]
    },
    subjectTo: [
        {
            name: 'cons1',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x2', coef: 1 },
                { name: 'x3', coef: 1 },
                { name: 'x4', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 300, lb: 300 }
        },
        {
            name: 'cons2',
            vars: [
                { name: 'x5', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x8', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 250, lb: 250 }
        },
        {
            name: 'cons3',
            vars: [
                { name: 'x9', coef: 1 },
                { name: 'x10', coef: 1 },
                { name: 'x11', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 200, lb: 200 }
        },
        {
            name: 'cons4',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x5', coef: 1 },
                { name: 'x9', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 220, lb: 220 }
        },
        {
            name: 'cons5',
            vars: [
                { name: 'x2', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x10', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 150, lb: 150 }
        },
        {
            name: 'cons6',
            vars: [
                { name: 'x3', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x11', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 250, lb: 250 }
        },
        {
            name: 'cons7',
            vars: [
                { name: 'x4', coef: 1 },
                { name: 'x8', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 180, lb: 180 }
        }
    ]
};

// закрытая
const res3 = {
    name: 'LP2',
    objective: {
        direction: glpk.GLP_MIN,
        name: 'obj',
        vars: [
            { name: 'x1', coef: 4 },
            { name: 'x2', coef: 5 },
            { name: 'x3', coef: 3 },
            { name: 'x4', coef: 6 },
            { name: 'x5', coef: 7 },
            { name: 'x6', coef: 2 },
            { name: 'x7', coef: 1 },
            { name: 'x8', coef: 5 },
            { name: 'x9', coef: 6 },
            { name: 'x10', coef: 1 },
            { name: 'x11', coef: 4 },
            { name: 'x12', coef: 2 },
            { name: 'x13', coef: 0 },
            { name: 'x14', coef: 0 },
            { name: 'x15', coef: 0 },
            { name: 'x16', coef: 0 },
        ]
    },
    subjectTo: [
        {
            name: 'cons1',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x2', coef: 1 },
                { name: 'x3', coef: 1 },
                { name: 'x4', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 300, lb: 300 }
        },
        {
            name: 'cons2',
            vars: [
                { name: 'x5', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x8', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 250, lb: 250 }
        },
        {
            name: 'cons3',
            vars: [
                { name: 'x9', coef: 1 },
                { name: 'x10', coef: 1 },
                { name: 'x11', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 200, lb: 200 }
        },
        {
            name: 'cons8',
            vars: [
                { name: 'x13', coef: 1 },
                { name: 'x14', coef: 1 },
                { name: 'x15', coef: 1 },
                { name: 'x16', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 50, lb: 50 }
        },
        {
            name: 'cons4',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x5', coef: 1 },
                { name: 'x9', coef: 1 },
                { name: 'x13', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 220, lb: 220 }
        },
        {
            name: 'cons5',
            vars: [
                { name: 'x2', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x10', coef: 1 },
                { name: 'x14', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 150, lb: 150 }
        },
        {
            name: 'cons6',
            vars: [
                { name: 'x3', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x11', coef: 1 },
                { name: 'x15', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 250, lb: 250 }
        },
        {
            name: 'cons7',
            vars: [
                { name: 'x4', coef: 1 },
                { name: 'x8', coef: 1 },
                { name: 'x12', coef: 1 },
                { name: 'x16', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 180, lb: 180 }
        }
    ]
};

// с ограничениями по времении ( не реализован интерфейс )
const res4 = {
    name: 'LP',
    objective: {
        direction: glpk.GLP_MIN,
        name: 'obj',
        vars: [
            { name: 'x1', coef: 4 },
            { name: 'x2', coef: 5 },
            { name: 'x3', coef: 6 },
            { name: 'x4', coef: 3 },
            { name: 'x5', coef: 2 },
            { name: 'x6', coef: 5 },
            { name: 'x7', coef: 4 },
            { name: 'x8', coef: 6 },
            { name: 'x9', coef: 3 },
            { name: 'x10', coef: 4 },
            { name: 'x11', coef: 7 },
            { name: 'x12', coef: 1 },
        ]
    },
    subjectTo: [
        {
            name: 'cons1',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x2', coef: 1 },
                { name: 'x3', coef: 1 },
                { name: 'x4', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 110, lb: 110 }
        },
        {
            name: 'cons2',
            vars: [
                { name: 'x5', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x8', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 190, lb: 190 }
        },
        {
            name: 'cons3',
            vars: [
                { name: 'x9', coef: 1 },
                { name: 'x10', coef: 1 },
                { name: 'x11', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 90, lb: 90 }
        },
        {
            name: 'cons4',
            vars: [
                { name: 'x1', coef: 1 },
                { name: 'x5', coef: 1 },
                { name: 'x9', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 80, lb: 80 }
        },
        {
            name: 'cons5',
            vars: [
                { name: 'x2', coef: 1 },
                { name: 'x6', coef: 1 },
                { name: 'x10', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 60, lb: 60 }
        },
        {
            name: 'cons6',
            vars: [
                { name: 'x3', coef: 1 },
                { name: 'x7', coef: 1 },
                { name: 'x11', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 170, lb: 170 }
        },
        {
            name: 'cons7',
            vars: [
                { name: 'x4', coef: 1 },
                { name: 'x8', coef: 1 },
                { name: 'x12', coef: 1 },
            ],
            bnds: { type: glpk.GLP_FX, ub: 80, lb: 80 }
        },
        {
            name: 'const8',
            vars: [
                { name: 'x1', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 32, lb: 0 }
        },
        {
            name: 'const9',
            vars: [
                { name: 'x2', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 18, lb: 0 }
        },
        {
            name: 'const10',
            vars: [
                { name: 'x3', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 60, lb: 0 }
        },
        {
            name: 'const11',
            vars: [
                { name: 'x4', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 32, lb: 0 }
        },
        {
            name: 'const12',
            vars: [
                { name: 'x5', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 40, lb: 0 }
        },
        {
            name: 'const13',
            vars: [
                { name: 'x6', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 30, lb: 0 }
        },
        {
            name: 'const14',
            vars: [
                { name: 'x7', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 84, lb: 0 }
        },
        {
            name: 'const15',
            vars: [
                { name: 'x8', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 40, lb: 0 }
        },
        {
            name: 'const16',
            vars: [
                { name: 'x9', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 12, lb: 0 }
        },
        {
            name: 'const17',
            vars: [
                { name: 'x10', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 18, lb: 0 }
        },
        {
            name: 'const18',
            vars: [
                { name: 'x11', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 36, lb: 0 }
        },
        {
            name: 'const19',
            vars: [
                { name: 'x12', coef: 1}
            ],
            bnds: { type: glpk.GLP_UP, ub: 24, lb: 0 }
        }
    ]
};