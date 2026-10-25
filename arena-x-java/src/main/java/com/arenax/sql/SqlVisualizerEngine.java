package com.arenax.sql;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * SQL Educational Visualization Engine.
 * Analyzes SQL queries and decomposes them into relational database execution steps
 * based on standard SQL logical processing order (FROM -> JOIN -> WHERE -> GROUP BY -> SELECT -> ORDER BY -> LIMIT).
 */
public class SqlVisualizerEngine {

    public static class PipelineStep {
        public final int stepNumber;
        public final String phaseName;
        public final String technicalExplanation;
        public final String subClause;

        public PipelineStep(int stepNumber, String phaseName, String technicalExplanation, String subClause) {
            this.stepNumber = stepNumber;
            this.phaseName = phaseName;
            this.technicalExplanation = technicalExplanation;
            this.subClause = subClause;
        }
    }

    public static List<PipelineStep> analyzeQuery(String sql) {
        List<PipelineStep> steps = new ArrayList<>();
        if (sql == null || sql.trim().isEmpty()) return steps;

        String cleanSql = sql.replaceAll("\\s+", " ").trim();
        String upper = cleanSql.toUpperCase();
        int step = 1;

        // 1. FROM & JOIN
        Pattern fromPattern = Pattern.compile("FROM\\s+([a-zA-Z0-9_]+)(\\s+(INNER|LEFT|RIGHT)?\\s*JOIN\\s+([a-zA-Z0-9_]+)\\s+ON\\s+([^WHERE|GROUP|ORDER|LIMIT]+))?", Pattern.CASE_INSENSITIVE);
        Matcher fromMatcher = fromPattern.matcher(cleanSql);
        if (fromMatcher.find()) {
            String baseTable = fromMatcher.group(1);
            String joinPart = fromMatcher.group(2);
            if (joinPart != null) {
                steps.add(new PipelineStep(step++, "1. FROM & RELATIONAL JOIN",
                        "Locates base table '" + baseTable + "' and executes Cartesian/Hash Join against foreign keys.",
                        "FROM " + baseTable + " " + joinPart.trim()));
            } else {
                steps.add(new PipelineStep(step++, "1. FROM (Table Scan / Index Lookup)",
                        "Identifies source relation '" + baseTable + "' from disk buffer cache.",
                        "FROM " + baseTable));
            }
        }

        // 2. WHERE
        Pattern wherePattern = Pattern.compile("WHERE\\s+(.+?)(?:GROUP BY|ORDER BY|LIMIT|$)", Pattern.CASE_INSENSITIVE);
        Matcher whereMatcher = wherePattern.matcher(cleanSql);
        if (whereMatcher.find()) {
            String condition = whereMatcher.group(1).trim();
            steps.add(new PipelineStep(step++, "2. WHERE (Tuple Predicate Filtering)",
                    "Evaluates boolean predicate per tuple. Non-matching rows are discarded prior to aggregation.",
                    "WHERE " + condition));
        }

        // 3. GROUP BY
        Pattern groupPattern = Pattern.compile("GROUP BY\\s+(.+?)(?:HAVING|ORDER BY|LIMIT|$)", Pattern.CASE_INSENSITIVE);
        Matcher groupMatcher = groupPattern.matcher(cleanSql);
        if (groupMatcher.find()) {
            String groupCols = groupMatcher.group(1).trim();
            steps.add(new PipelineStep(step++, "3. GROUP BY (Bucket Aggregation)",
                    "Partitions tuples into grouped equivalence classes based on: " + groupCols,
                    "GROUP BY " + groupCols));
        }

        // 4. SELECT
        Pattern selectPattern = Pattern.compile("SELECT\\s+(.+?)\\s+FROM", Pattern.CASE_INSENSITIVE);
        Matcher selectMatcher = selectPattern.matcher(cleanSql);
        if (selectMatcher.find()) {
            String cols = selectMatcher.group(1).trim();
            steps.add(new PipelineStep(step++, "4. SELECT (Column Projection & Expressions)",
                    "Projects only the requested attributes and computes aggregate expressions.",
                    "SELECT " + cols));
        }

        // 5. ORDER BY
        Pattern orderPattern = Pattern.compile("ORDER BY\\s+(.+?)(?:LIMIT|$)", Pattern.CASE_INSENSITIVE);
        Matcher orderMatcher = orderPattern.matcher(cleanSql);
        if (orderMatcher.find()) {
            String orderCols = orderMatcher.group(1).trim();
            steps.add(new PipelineStep(step++, "5. ORDER BY (Result Set Sorting)",
                    "Performs quicksort/filesort on projected tuples according to: " + orderCols,
                    "ORDER BY " + orderCols));
        }

        // 6. LIMIT
        Pattern limitPattern = Pattern.compile("LIMIT\\s+(\\d+)", Pattern.CASE_INSENSITIVE);
        Matcher limitMatcher = limitPattern.matcher(cleanSql);
        if (limitMatcher.find()) {
            String limitCount = limitMatcher.group(1).trim();
            steps.add(new PipelineStep(step++, "6. LIMIT (Pagination Window)",
                    "Truncates output stream to the first " + limitCount + " rows.",
                    "LIMIT " + limitCount));
        }

        return steps;
    }
}
