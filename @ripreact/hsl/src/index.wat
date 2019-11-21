(module
    (import "Math" "cos" (func (param f32) (result f32)))
    (import "Math" "pow" (func (param f32 f32) (result f32)))

    (memory 1)

    (data (i32.const 4)
        ;; 4 — M
        "\0d\6c\4f\40" "\f9\c8\c4\bf" "\e9\49\ff\be"
        "\5a\20\78\bf" "\b4\1f\f0\3f" "\a3\35\2a\3d"
        "\5e\dc\63\3d" "\56\df\50\be" "\d8\4a\87\3f"

        ;; "\39\64\1e\a6\81\ed\09\40"
        ;; "\84\58\51\1a\1f\99\f8\bf"
        ;; "\aa\18\39\1b\3d\e9\df\bf"

        ;; "\ad\d6\f5\3a\0b\04\ef\bf"
        ;; "\10\5a\b5\7f\f6\03\fe\3f"
        ;; "\1d\2d\18\59\b4\46\a5\3f"

        ;; "\15\e6\f1\b9\8b\7b\ac\3f"
        ;; "\a2\67\c8\bf\ea\1b\ca\bf"
        ;; "\ce\a0\67\f6\5a\e9\f0\3f"
    )

    (func (export "hsl") (param $h f32) (param $s f32) (param $l f32) (result i32)
        (local $hcos f32) ;; 3
        (local $hsin f32) ;; 4

        (local $t f32) ;; 5
        (local $sub f32) ;; 6
        (local $bottom f32) ;; 7
        (local $c f32) ;; 8

        (local $m1 f32) ;; 9
        (local $m2 f32) ;; 10
        (local $m3 f32) ;; 11

        (local $i i32) ;; 12

        (local $rgb i32) ;; 13

        ;; h = h - trunc(h / 360) * 360
        (local.set $h (f32.sub
            (local.get $h)
            (f32.mul (f32.trunc (f32.div (local.get $h) (f32.const 360))) (f32.const 360))))

        ;; h = h < 0 ? h + 360 : h
        (if (f32.lt (local.get $h) (f32.const 0))
            (then (local.set $h (f32.add (local.get $h) (f32.const 360)))))

        ;; h = (h * PI) / 180
        (local.set $h (f32.div (f32.mul (local.get $h) (f32.const 3.141592653589793)) (f32.const 180)))

        ;; hcos = cos(h)
        (local.set $hcos (call 0 (local.get $h)))

        ;; ;; hcos = cos(h)
        ;; (local.set $hcos (local.get $h))

        ;; hsin = sqrt(1 - hcos * hcos)
        (local.set $hsin (f32.sqrt (f32.sub (f32.const 1) (f32.mul (local.get $hcos) (local.get $hcos)))))

        ;; hsin = h > PI ? -hsin : hsin
        (if (f32.gt (local.get $h) (f32.const 3.141592653589793))
            (then (local.set $hsin (f32.neg (local.get $hsin)))))

        ;; h = l + 16
        (local.set $h (f32.add (local.get $l) (f32.const 16)))

        ;; sub = h ** 3 / 1560896
        (local.set $sub (f32.div
            (f32.mul (f32.mul (local.get $h) (local.get $h)) (local.get $h))
            (f32.const 1560896)))

        ;; sub = sub > 0.0088564516 ? sub : l / 903.2962962
        (if (f32.gt (local.get $sub) (f32.const 0.0088564516))
            (then)
            (else (local.set $sub (f32.div (local.get $l) (f32.const 903.2962962)))))

        ;; c = Infinity
        (local.set $c (f32.const inf))
        (loop
            ;; m1-3 = M[i = i + 8]
            (local.set $m1 (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))))
            (local.set $m2 (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))))
            (local.set $m3 (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))))

            ;; t = 0
            (local.set $t (f32.const 0))
            (loop
                ;; bottom = (632260 * m3 - 126452 * m2) * sub + 126452 * t
                (local.set $bottom (f32.add
                    (f32.mul
                        (f32.sub
                            (f32.mul (f32.const 632260) (local.get $m3))
                            (f32.mul (f32.const 126452) (local.get $m2)))
                        (local.get $sub))
                    (f32.mul (f32.const 126452) (local.get $t))))

                ;; length = (((838422 * m3 + 769860 * m2 + 731718 * m1) * l * sub - 769860 * t * l) / bottom) / (hsin - (((284517 * m1 - 94839 * m3) * sub) / bottom) * hcos)
                (local.set $bottom (f32.div
                    (f32.div
                        (f32.sub
                            (f32.mul (f32.mul
                                (f32.add (f32.add
                                    (f32.mul (f32.const 838422) (local.get $m3))
                                    (f32.mul (f32.const 769860) (local.get $m2)))
                                    (f32.mul (f32.const 731718) (local.get $m1)))
                                (local.get $l))
                                (local.get $sub))
                            (f32.mul (f32.mul
                                (f32.const 769860)
                                (local.get $t))
                                (local.get $l)))
                        (local.get $bottom))
                    (f32.sub
                        (local.get $hsin)
                        (f32.mul
                            (f32.div
                                (f32.mul
                                    (f32.sub
                                        (f32.mul (f32.const 284517) (local.get $m1))
                                        (f32.mul (f32.const 94839) (local.get $m3)))
                                    (local.get $sub))
                                (local.get $bottom))
                            (local.get $hcos)))))

                ;; cmax = length >= 0 ? min(c, length) : c
                (if (f32.ge (local.get $bottom) (f32.const 0))
                    (then (local.set $c (f32.min (local.get $c) (local.get $bottom)))))

                ;; t = t + 1
                (local.set $t (f32.add (local.get $t) (f32.const 1)))

                ;; continue if: t == 1
                (br_if 0 (f32.eq (local.get $t) (f32.const 1))))

            ;; continue if: i < 72
            (br_if 0 (i32.lt_u (local.get $i) (i32.const 36))))

        ;; t = 13 * l
        (local.set $t (f32.mul (f32.const 13) (local.get $l)))

        ;; h = (l + 16) / 116
        (local.set $h (f32.div (local.get $h) (f32.const 116)))

        ;; c = (cmax / 100) * s
        (local.set $c (f32.mul (f32.div (local.get $c) (f32.const 100)) (local.get $s)))

        ;; varU = (hcos * c) / t + refU
        (local.set $hcos (f32.add (f32.div (f32.mul (local.get $hcos) (local.get $c)) (local.get $t)) (f32.const 0.19783000664283)))

        ;; varV = (hsin * c) / t + refV
        (local.set $hsin (f32.add (f32.div (f32.mul (local.get $hsin) (local.get $c)) (local.get $t)) (f32.const 0.46831999493879)))

        ;; y = l <= 8 ? l / kappa : (l + 16 / 116) ** 3
        (local.set $m2 (if (result f32) (f32.le (local.get $l) (f32.const 8))
            (then (f32.div (local.get $l) (f32.const 903.2962962)))
            (else (f32.mul (local.get $h) (f32.mul (local.get $h) (local.get $h)))))) ;; h ** 3

        ;; x = (-9 * y * varU) / ((varU - 4) * varV - varU * varV)
        (local.set $m1 (f32.div
            (f32.mul (f32.const -9) (f32.mul (local.get $m2) (local.get $hcos)))
            (f32.sub
                (f32.mul (f32.sub (local.get $hcos) (f32.const 4)) (local.get $hsin))
                (f32.mul (local.get $hcos) (local.get $hsin)))))

        ;; z = (9 * y - (15 * varV * y) - (varV * x)) / (3 * varV)
        (local.set $m3 (f32.div
            (f32.sub (f32.sub
                (f32.mul (f32.const 9) (local.get $m2))
                (f32.mul (f32.mul (f32.const 15) (local.get $hsin)) (local.get $m2)))
                (f32.mul (local.get $hsin) (local.get $m1)))
            (f32.mul (f32.const 3) (local.get $hsin))))

        ;; i = 0
        (local.set $i (i32.const 0))
        (loop (result i32)
            ;; dot = m1 * x + m2 * y + m3 * z
            (local.set $h (f32.add (f32.add
                (f32.mul (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))) (local.get $m1))
                (f32.mul (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))) (local.get $m2)))
                (f32.mul (f32.load (local.tee $i (i32.add (local.get $i) (i32.const 4)))) (local.get $m3))))

            ;; h = dot <= 0.0031308 ? 12.92 * dot : 1.055 * pow(dot, 0.4166666666666667) - 0.055
            (local.set $h (if (result f32) (f32.le (local.get $h) (f32.const 0.0031308))
                (then (f32.mul (f32.const 12.92) (local.get $h)))
                (else (f32.sub
                    (f32.mul (f32.const 1.055) (call 1 (local.get $h) (f32.const 0.4166666666666667)))
                    (f32.const 0.055)))))

            ;; h = h == h ? h : 0
            (if (f32.eq (local.get $h) (local.get $h))
                (then)
                (else (local.set $h (f32.const 0))))

            ;; rgb = (rgb | I32(round(max(0, min(h, 1)) * 255))) << 8
            (local.tee $rgb (i32.or
                (i32.shl (local.get $rgb) (i32.const 8))
                (i32.trunc_f32_u (f32.nearest (f32.mul
                    (f32.max (f32.const 0) (f32.min (local.get $h) (f32.const 1)))
                    (f32.const 255))))))

            ;; continue if: i < 72
            (br_if 0 (i32.lt_u (local.get $i) (i32.const 36)))))

    ;; (func (param $x f32) (result f32)
    ;;     ;; x = x - (0.25 + Math.floor(x * 0.15915494309189535 + 0.25))
    ;;     (local.set $x (f32.sub
    ;;         (local.get $x)
    ;;         ;;
    ;;     ))
    ;; )
)
