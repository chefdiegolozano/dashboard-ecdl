import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

/**
 * Drop-in replacement for useLocalStorage que sincroniza com o Supabase.
 *
 * Comportamento:
 *  1. Retorna localStorage imediatamente (sem flash de carregamento).
 *  2. Busca do Supabase em background; quando chega, substitui o estado.
 *  3. Cada atualização salva em localStorage (síncrono) + Supabase (async).
 *  4. Se o Supabase falhar, localStorage continua funcionando como fallback.
 */
export function useSupabaseData(key, defaultValue) {
  const [data, setDataState] = useState(() => readLocal(key, defaultValue));

  // Carrega do Supabase ao montar
  useEffect(() => {
    supabase
      .from('app_data')
      .select('value')
      .eq('key', key)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error) {
          console.warn(`[db] load "${key}" falhou — usando localStorage:`, error.message);
          return;
        }
        if (row?.value !== undefined) {
          setDataState(row.value);
          writeLocal(key, row.value);
        }
      });
  }, [key]);

  const setData = (valueOrUpdater) => {
    setDataState(prev => {
      const next = typeof valueOrUpdater === 'function'
        ? valueOrUpdater(prev)
        : valueOrUpdater;

      // Persiste localmente de forma síncrona (imediato)
      writeLocal(key, next);

      // Persiste no Supabase de forma assíncrona (fire-and-forget)
      supabase
        .from('app_data')
        .upsert(
          { key, value: next, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
        .then(({ error }) => {
          if (error) console.warn(`[db] save "${key}" falhou:`, error.message);
        });

      return next;
    });
  };

  return [data, setData];
}
